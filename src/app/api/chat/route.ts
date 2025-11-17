import { streamText } from "ai";
import { google, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { createClient } from "@/util/supabase/server";
import { redirect } from "next/navigation";

export async function GET() {
    return redirect("/");
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

            const { data: userData, error } = await supabase.auth.getUser();

            if (error || !userData.user) {
                return new Response("Unauthorized", { status: 401 });
            }

            const { data: msgData, error: msgError } = await supabase.rpc(
                "add_message",
                {
                    p_chat_id: chatId,
                    p_sender_id: userData.user.id,
                    p_sender_role: "user",
                    p_content: prompt,
                    p_model_name: null,
                },
            );

            if (msgError) {
                console.error("Error inserting message:", msgError);
                return new Response("Failed to insert message", {
                    status: 500,
                });
            }
        } catch (error) {
            console.error("Supabase auth error:", error);
            return new Response("Unauthorized", { status: 401 });
        }
    }

    try {
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
            onError: (err) => {
                console.error("Error during text streaming:", err);
                throw err;
            },
            onFinish: async ({ text, reasoningText }) => {
                // store the AI response in the database

                // format the full text with reasoning if available
                const content =
                    `<reasoning-start>\n${reasoningText}\n<reasoning-end>\n\n<text-start>\n${text}\n<text-end>`;

                try {
                    const supabase = createClient();

                    const { data: aiMsgData, error: aiMsgError } =
                        await supabase.rpc(
                            "add_message",
                            {
                                p_chat_id: chatId,
                                p_sender_id: null,
                                p_sender_role: "assistant",
                                p_content: content,
                                p_model_name: "gemini-2.5-pro",
                            },
                        );

                    if (aiMsgError) {
                        throw aiMsgError;
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
    } catch (err) {
        console.error("Error in chat route:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
