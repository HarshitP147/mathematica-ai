import { NextResponse } from "next/server";
import { v4 } from "uuid";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { createClient } from "@/util/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    const supabase = createClient();

    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData.user) {
        return NextResponse.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    // generate a chat name based on the prompt
    const { prompt } = await req.json();

    let chatName;

    try {
        const aiResponse = await generateText({
            model: google("gemini-2.5-flash-lite"),
            system: "You are a helpful assistant that generates chat names.",
            prompt:
                `Generate a concise and descriptive chat name for the following prompt, in less than 5 words:\n\n"${prompt}"\n\nChat Name:`,
        });

        chatName = aiResponse.text ? aiResponse.text.trim() : "New Chat";
    } catch (error) {
        console.error("AI generation error:", error);
        return NextResponse.json({
            message: "Failed to generate chat name",
            status: 500,
        });
    }

    const chatId = v4();

    const { data: insertData, error: insertError } = await supabase
        .from("chats")
        .insert({ chat_id: chatId, chat_name: chatName });

    if (insertError) {
        return NextResponse.json({
            message: "Failed to create chat",
            status: 500,
        });
    }

    const { data: userChatData, error: userChatError } = await supabase
        .from("user_chats")
        .insert({ user_id: userData.user.id, chat_id: chatId });

    if (userChatError) {
        return NextResponse.json({
            message: "Failed to associate user with chat",
            status: 500,
        });
    }

    // Revalidate the home page to update the chat list
    revalidatePath("/");

    // Return the chat ID so client can redirect
    return NextResponse.json({
        message: "Chat created successfully",
        chatId: chatId,
        status: 201,
    });
}
