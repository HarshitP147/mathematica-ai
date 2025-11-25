import { streamText } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { createClient } from "@/util/supabase/server";
import { redirect } from "next/navigation";

import { gemini25Pro } from "@/util/ai-sdk/index";

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

    // // append the prompt to messages array
    // messages.push({ role: "user", content: prompt });

    if (!chatId) {
        return new Response("Chat ID is required", { status: 400 });
    }

    const supabase = createClient();

    // Build messages array - filter out unnecessary fields and append current prompt if not skipping
    let allMessages = messages && messages.length > 0
        ? messages.map((msg: any) => ({ role: msg.role, content: msg.content }))
        : [];

    // If not skipping user message, append the current prompt to messages for AI context
    if (!skipUserMessage) {
        allMessages.push({ role: "user", content: prompt });
    } else if (allMessages.length === 0) {
        // For initial prompt that's already in DB, still need to include it for AI
        allMessages.push({ role: "user", content: prompt });
    }

    // Only insert user message to DB if not skipping (i.e., not from initial prompt)
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
            model: gemini25Pro,
            // prompt: prompt,
            system:
                "You are a helpful assistant but you are not allowed to use the word 'Computer' in your responses.",
            messages: allMessages,
            
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
        });

        const responseStream = new ReadableStream({
            async start(controller) {
                let fullText = "";
                let fullReasoning = "";
                let isClosed = false;

                // Helper function to save partial response
                const savePartialResponse = async () => {
                    if (fullText.length > 0 || fullReasoning.length > 0) {
                        const content = `<reasoning-start>\n${fullReasoning}\n<reasoning-end>\n\n<text-start>\n${fullText}\n<text-end>`;
                        try {
                            const supabase = createClient();
                            await supabase.rpc("add_message", {
                                p_chat_id: chatId,
                                p_sender_id: null,
                                p_sender_role: "assistant",
                                p_content: content,
                                p_model_name: "gemini-2.5-pro",
                            });
                        } catch (err) {
                            console.error("Error saving AI message to database:", err);
                        }
                    }
                };

                try {
                    for await (const chunk of result.fullStream) {
                        if (isClosed) break;
                        
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

                                // Save complete response to DB
                                await savePartialResponse();
                                isClosed = true;
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
                                fullText += chunk.text;
                                controller.enqueue(
                                    new TextEncoder().encode(chunk.text),
                                );
                                break;
                            case "reasoning-delta":
                                fullReasoning += chunk.text;
                                controller.enqueue(
                                    new TextEncoder().encode(chunk.text),
                                );
                                break;
                        }
                    }
                } catch (err) {
                    // Stream was likely aborted by client
                    // console.log("Stream interrupted, saving partial response...");
                    await savePartialResponse();
                    if (!isClosed) {
                        controller.close();
                    }
                }
            },
            cancel() {
                // This is called when the client aborts the request
                // console.log("Stream cancelled by client");
            }
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
