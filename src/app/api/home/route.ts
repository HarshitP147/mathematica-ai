import { NextResponse } from "next/server";
import { v4 } from "uuid";

import { createClient } from "@/util/supabase/server";
import { revalidatePath } from "next/cache";


export async function POST(req: Request) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        return NextResponse.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const { chatName } = await req.json();

    if (!chatName) {
        return NextResponse.json({
            message: "Chat name is required",
            status: 400,
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

    // Revalidate the home page to update the chat list
    revalidatePath("/");

    // Return the chat ID so client can redirect
    return NextResponse.json({
        message: "Chat created successfully",
        chatId: chatId,
        status: 201,
    });
}
