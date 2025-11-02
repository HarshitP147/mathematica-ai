import type { Metadata } from "next";

import ChatPromptInput from "@/components/layout/chat-prompt";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ResponseExample from "@/components/atom/response-example";

export const metadata: Metadata = {
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    return (
        <div className="min-h-screen min-w-full relative overflow-auto">
            <header className="border border-b  shadow-md  flex justify-around items-center-safe py-3  gap-x-3  ">
                <SidebarTrigger className=" ml-3 justify-start hover:cursor-pointer p-4 rounded-full" />
                <div className="flex-1 text-center ">
                    {/* <h1 className="text-2xl font-bold ">{chat ? chat.name : resolvedParams.slug}</h1> */}
                </div>
            </header>
            {/* content area could render messages here */}
            <ResponseExample  />

            <footer className="fixed bottom-0 left-0 right-0 px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    <ChatPromptInput />
                </div>
            </footer>
        </div>
    )
}