"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";

import { gemini25Flash } from "@/lib/ai-sdk";
import { createClient } from "@/util/supabase/server";

export async function createNewChatAction(state: any, formData: FormData) {
    const supabase = createClient();

    const prompt = formData.get("prompt") as string;
    const includeThinking = formData.get("includeThinking");

    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData.user) {
        throw new Error("Unauthorized");
    }

    // generate a chat name based on the prompt

    const aiResponse = await generateText({
        model: gemini25Flash, // Use Google model for chat name generation
        system: "You are a helpful assistant that generates chat names.",
        prompt:
            `Generate a concise and descriptive chat name for the following prompt, in less than 5 words:\n\n"${prompt}"\n\nChat Name:`,
    });

    const chatName = aiResponse.text.trim();

    const { data: chatId, error: rpcError } = await supabase.rpc(
        "create_chat",
        {
            p_user_id: userData.user.id,
            p_chat_name: chatName,
        },
    );

    if (rpcError) {
        console.error("Error creating new chat:", rpcError);
        throw new Error("Failed to create new chat");
    }

    const files = formData.getAll("files") as File[];
    let storageMedia = [];

    for (const file of files) {
        console.log(file);
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from("chat-media")
            .upload(`${userData.user.id}/${chatId}/${file.name}`, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type,
            });

        if (storageError) {
            console.error("Error uploading file:", storageError);
            throw new Error("Failed to upload file");
        }

        storageMedia.push(storageData.fullPath);
    }

    // add the new message as the first message in the chat
    const { data: messageInfo, error: messageAddError } = await supabase.rpc(
        "add_message",
        {
            p_chat_id: chatId,
            p_sender_id: userData.user.id,
            p_sender_role: "user",
            p_content: prompt,
            p_model_name: null,
            p_msg_media: storageMedia,
        },
    );

    if (messageAddError) {
        console.error("Error adding message:", messageAddError);
        throw new Error("Failed to add message");
    }

    revalidatePath("/chat");

    redirect(`/chat/${chatId}`);
}
