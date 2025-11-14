"use server";

import { redirect, } from "next/navigation";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { createClient } from "@/util/supabase/server";

export async function createNewChatAction(state: any, formData: FormData) {
    const supabase = createClient();

    const prompt = formData.get("prompt") as string;

    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData.user) {
        throw new Error("Unauthorized");
    }

    // generate a chat name based on the prompt

    const aiResponse = await generateText({
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant that generates chat names.",
        prompt:
            `Generate a concise and descriptive chat name for the following prompt, in less than 5 words:\n\n"${prompt}"\n\nChat Name:`,
    });

    const chatName = aiResponse.text.trim();

    console.log("AI Response for chat name:", chatName);

    const { data: chatId, error: rpcError } = await supabase.rpc("create_chat", {
        p_user_id: userData.user.id,
        p_chat_name: chatName,
    });

    if (rpcError) {
        console.error("Error creating new chat:", rpcError);
        throw new Error("Failed to create new chat");
    }

    redirect(`/chat/${chatId}`);
}
