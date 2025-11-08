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
            <header className="border border-b  shadow-md  flex justify-around items-center-safe py-3  gap-x-3  ">
                <SidebarTrigger className=" ml-3 justify-start hover:cursor-pointer p-4 rounded-full" />
                <div className="flex-1 text-center ">
                    <h1 className="text-2xl font-bold ">{chat ? chat.name : resolvedParams.slug}</h1>
                </div>
            </header>
            {/* content area could render messages here */}
            <ChatBody />
        </div>
    )
}   