
import { ChatContainerRoot } from "@/components/ui/chat-container"
import { ScrollButton } from "@/components/ui/scroll-button"
import ChatPromptInput from "@/components/layout/chat-prompt"
import Messages from "@/components/layout/messages"

import { chatAction } from "@/app/chat/[slug]/action"


export default function ChatBody({ slug }: { slug?: string }) {
    return (
        <ChatContainerRoot >
            <Messages slug={slug} />


            <footer className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-transparent">
                <div className="max-w-4xl mx-auto relative">
                    <ScrollButton variant={"default"} className="absolute -top-16 left-1/2 -translate-x-1/2 z-30" />
                    <ChatPromptInput action={chatAction} />
                </div>
            </footer>


        </ChatContainerRoot>
    )
}