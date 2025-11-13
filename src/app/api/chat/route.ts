import { streamText } from "ai";
import { google, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { createClient } from "@/util/supabase/server";
import { v4 } from "uuid";

export const maxDuration = 300; // 5 minutes

export async function GET() {
    return new Response("Chat endpoint is live");
}

export async function POST(req: Request) {
    const {
        messages,
        includeThinking,
        prompt,
        chatId,
        skipUserMessage = false,
    } = await req
        .json();

    // append the prompt to messages array
    messages.push({ role: "user", content: prompt });

    if (!chatId) {
        return new Response("Chat ID is required", { status: 400 });
    }

    const supabase = createClient();

    // Only insert user message if not skipping (i.e., not from initial prompt)
    if (!skipUserMessage) {
        try {
            const messageId = v4();

            const { data: userData, error } = await supabase.auth.getUser();

            if (error || !userData.user) {
                return new Response("Unauthorized", { status: 401 });
            }

            const { data: msgData, error: msgError } = await supabase.from(
                "messages",
            ).insert({
                message_id: messageId,
                content: prompt,
                role: "user",
                chat_id: chatId,
            });

            if (msgError) {
                console.error("Error inserting message:", msgError);
                return new Response("Failed to insert message", {
                    status: 500,
                });
            }

            // lastly, associate with the user
            const { data: userMsgData, error: userMsgError } = await supabase
                .from("user_msgs")
                .insert({
                    user_id: userData.user.id,
                    message_id: messageId,
                    sender_type: "user",
                    model_name: null,
                });

            if (userMsgError) {
                console.error(
                    "Error associating message with user:",
                    userMsgError,
                );
                return new Response("Failed to associate message with user", {
                    status: 500,
                });
            }
        } catch (error) {
            console.error("Supabase auth error:", error);
            return new Response("Unauthorized", { status: 401 });
        }
    }

    // now generate the AI response as a stream
    const result = streamText({ // model: google("gemini-2.5-pro"),
        model: google("gemini-2.5-pro"),
        // prompt: prompt,
        messages: messages,
        providerOptions: {
            google: {
                thinkingConfig: {
                    includeThoughts: includeThinking,
                    thinkingBudget: 16284,
                },
            } satisfies GoogleGenerativeAIProviderOptions,
        },
        onChunk: ({ chunk }) => {
            if (chunk.type === "source") {
                console.log(chunk);
            }
        },
        onFinish: async ({ text, reasoningText }) => {
            // store the AI response in the database
            const aiMessageId = v4();

            // format the full text with reasoning if available
            const content =
                `<reasoning-start>\n${reasoningText}\n<reasoning-end>\n\n<text-start>\n${text}\n<text-end>`;

            try {
                const supabase = createClient();

                const { data: aiMsgData, error: aiMsgError } = await supabase
                    .from("messages")
                    .insert({
                        message_id: aiMessageId,
                        content: content,
                        role: "assistant",
                        chat_id: chatId,
                    });

                if (aiMsgError) {
                    throw aiMsgError;
                }

                // Associate AI message with model in user_msgs table
                const { data: aiUserMsgData, error: aiUserMsgError } =
                    await supabase
                        .from("user_msgs")
                        .insert({
                            user_id: null,
                            message_id: aiMessageId,
                            sender_type: "model",
                            model_name: "gemini-2.5-pro",
                        });

                if (aiUserMsgError) {
                    throw aiUserMsgError;
                }
            } catch (err) {
                console.error("Error saving AI message to database:", err);
            }
        },
    });

    const responseStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of result.fullStream) {
                switch (chunk.type) {
                    case "text-start":
                        controller.enqueue(
                            new TextEncoder().encode("<text-start>"),
                        );
                        break;
                    case "text-end":
                        controller.enqueue(
                            new TextEncoder().encode("<text-end>"),
                        );
                        controller.close();
                        break;
                    case "reasoning-start":
                        controller.enqueue(
                            new TextEncoder().encode("<reasoning-start>"),
                        );
                        break;
                    case "reasoning-end":
                        controller.enqueue(
                            new TextEncoder().encode("<reasoning-end>"),
                        );
                        break;
                    case "text-delta":
                    case "reasoning-delta":
                        controller.enqueue(
                            new TextEncoder().encode(chunk.text),
                        );
                        break;
                }
            }
        },
    });

    return new Response(responseStream, {
        headers: {
            "Content-Type": "text/event-stream",
        },
    });
}
