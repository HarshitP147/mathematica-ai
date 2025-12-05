import { revalidatePath } from "next/cache";

import { createClient } from "@/util/supabase/server";

export async function addMessageWithMediaAction(formData: FormData) {
    const supabase = createClient();

    const chatId = formData.get("chatId") as string;
    const prompt = formData.get("prompt") as string;

    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData.user) {
        throw new Error("Unauthorized");
    }

    const files = formData.getAll("files") as File[];
    let storageIds = [];

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
        storageIds.push(storageData.id);
    }

    // add the new message with media
    const { data: messageInfo, error: messageAddError } = await supabase.rpc(
        "add_message",
        {
            p_chat_id: chatId,
            p_sender_id: userData.user.id,
            p_sender_role: "user",
            p_content: prompt,
            p_model_name: null,
            p_msg_media: storageIds,
        },
    );

    if (messageAddError) {
        console.error("Error adding message with media:", messageAddError);
        throw new Error("Failed to add message with media");
    }

    revalidatePath("/chat");

    return {
        messageInfo,
    };
}
