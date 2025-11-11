import type { Metadata } from "next";

import { SidebarTrigger } from "@/components/ui/sidebar";
import ChatBody from "@/components/layout/chat-body";

import { createClient } from "@/util/supabase/server";

async function getChatName(slug: string) {
    const supabase = createClient();

    const chat = await supabase
        .from("chats")
        .select("chat_name")
        .eq("chat_id", slug)
        .single();

    return chat.data ? chat.data.chat_name : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;

    const chatName = await getChatName(resolvedParams.slug);
    const chat = chatName ? { name: chatName } : null;

    return {
        title: chat ? chat.name : resolvedParams.slug
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    const chatName = await getChatName(resolvedParams.slug);
    const chat = chatName ? { name: chatName } : null;

    return (
        <div className="min-h-screen min-w-full relative overflow-auto">

            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm flex items-center py-3 gap-x-3 px-4">
                <SidebarTrigger className="hover:cursor-pointer p-2 rounded-lg hover:bg-accent" />
                <div className="flex-1 text-center">
                    <h1 className="text-xl font-semibold">{chat ? chat.name : resolvedParams.slug}</h1>
                </div>
                <div className="w-10" /> {/* Spacer for visual balance */}
            </header>

            {/* content area could render messages here */}

            <ChatBody />

        </div>
    )
}   