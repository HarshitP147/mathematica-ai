import {
    FilePart,
    ImagePart,
    type ModelMessage,
    streamText,
    TextPart,
    TypeValidationError,
} from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { createClient } from "@/util/supabase/server";
import { redirect } from "next/navigation";

import { gemini25Pro } from "@/lib/ai-sdk";

export async function GET() {
    return redirect("/");
}

type MessageContentPart = string | Array<TextPart | ImagePart | FilePart>;

export async function POST(req: Request) {
    const {
        includeThinking,
        chatId,
    } = await req
        .json();

    if (!chatId) {
        return new Response("Chat ID is required", { status: 400 });
    }

    const supabase = createClient();

    const supabaseAuth = await supabase.auth.getUser();

    if (!supabaseAuth.data.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = supabaseAuth.data.user.id;

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    // get all the messages for the chat from the database
    const { data: messages, error } = await supabase.from("messages")
        .select("role, content, msg_media")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error);
        return new Response("Error fetching messages", { status: 500 });
    }

    const chatMediaBucket = supabase.storage.from("chat-media");

    // Build messages array with proper MessageType structure and file content
    let allMessages: ModelMessage[] = [];

    if (messages && messages.length > 0) {
        for (const msg of messages) {
            // Determine the role type
            const role = msg.role as "user" | "assistant" | "system" | "tool";

            // Start with text content (ModelMessage allows string or parts array)
            let messageContent: MessageContentPart;

            // If message has files, then we need to build parts array
            if (msg.msg_media && msg.msg_media.length > 0) {
                const textContent = {
                    type: "text" as const,
                    text: msg.content,
                };

                // now the files part
                let content: Array<TextPart | ImagePart | FilePart> = [];

                for (const mediaPath of msg.msg_media) {
                    // remove the chat-media part fromt eh path
                    const requiredMediaPath = mediaPath.replace(
                        "chat-media/",
                        "",
                    );

                    const { data: fileDownloadData, error: downloadError } =
                        await chatMediaBucket.download(
                            requiredMediaPath,
                        );

                    if (downloadError || !fileDownloadData) {
                        console.error("Error downloading the file");
                        throw downloadError; // skip this file
                    }

                    const arrayBuffer = await fileDownloadData.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const base64String = Buffer.from(uint8Array).toString(
                        "base64",
                    );

                    const ext = mediaPath.split(".").pop()?.toLowerCase();
                    let mediaType;

                    if (
                        ["jpg", "jpeg", "png", "gif", "webp"].includes(
                            ext,
                        )
                    ) {
                        mediaType = `image/${ext === "jpg" ? "jpeg" : ext}`;
                    } else if (ext === "pdf") {
                        mediaType = "application/pdf";
                    } else if (ext === "txt") {
                        mediaType = "text/plain";
                    } else if (ext === "md") {
                        mediaType = "text/markdown";
                    } else if (ext === "mp4") {
                        mediaType = "video/mp4";
                    } else if (ext === "mp3") {
                        mediaType = "audio/mpeg";
                    }

                    const isImage = mediaType?.startsWith("image/");

                    // Determine if it's an image or generic file based on extension
                    if (isImage) {
                        // It's an image
                        content.push({
                            type: "image",
                            image: base64String,
                        } as ImagePart);
                    } else {
                        // It's a generic file
                        content.push({
                            type: "file",
                            data: base64String,
                            mediaType: mediaType!,
                        });
                    }
                }

                // Combine text content and parts
                messageContent = [textContent, ...content];
            } else {
                messageContent = msg.content;
            }

            // Create message with proper MessageType structure
            const baseMessage: any = {
                role: msg.role,
                content: messageContent,
            };

            // Push to allMessages array
            allMessages.push(baseMessage);
        }
    }

    // for (const message of allMessages) {
    //     console.log(message.role);
    //     console.dir(message.content, { depth: null });
    // }

    // DO NOT EDIT THIS PART BELOW - IT IS COMMENTED OUT FOR TESTING PURPOSES ONLY
    // Build messages array - filter out unnecessary fields and append current prompt if not skipping

    try {
        // Use default model
        const selectedModel = gemini25Pro;
        const isGoogleModel = true;

        // Configure provider options for Google models
        const providerOptions = {
            google: {
                thinkingConfig: {
                    includeThoughts: includeThinking,
                    thinkingBudget: 8192,
                },
            } satisfies GoogleGenerativeAIProviderOptions,
        };

        // Generate the AI response as a stream
        const result = streamText({
            model: selectedModel,
            system: "You are a helpful assistant.",
            messages: allMessages,
            providerOptions,
            onChunk: ({ chunk }) => {
                if (chunk.type === "source") {
                    console.log(chunk);
                }
            },
            onError: (err) => {
                console.dir(err, { depth: null });
                if (TypeValidationError.isInstance(err)) {
                    console.log("There has to be a type validation error:");
                }
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
                        const content = isGoogleModel
                            ? `<reasoning-start>\n${fullReasoning}\n<reasoning-end>\n\n<text-start>\n${fullText}\n<text-end>`
                            : `<text-start>\n${fullText}\n<text-end>`;
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
                            console.error(
                                "Error saving AI message to database:",
                                err,
                            );
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
                                // Only include reasoning for Google models
                                if (isGoogleModel) {
                                    controller.enqueue(
                                        new TextEncoder().encode(
                                            "<reasoning-start>",
                                        ),
                                    );
                                }
                                break;
                            case "reasoning-end":
                                // Only include reasoning for Google models
                                if (isGoogleModel) {
                                    controller.enqueue(
                                        new TextEncoder().encode(
                                            "<reasoning-end>",
                                        ),
                                    );
                                }
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

    // return new Response("API is under maintenance", { status: 200 });
}
