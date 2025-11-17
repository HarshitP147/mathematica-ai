'use client'

import { ChatContainerRoot } from "@/components/ui/chat-container"
import { ScrollButton } from "@/components/ui/scroll-button"
import ChatPromptInput from "@/components/layout/chat-prompt"
import Messages from "@/components/layout/messages"


export default function ChatBody({ slug }: { slug?: string }) {

    async function handleSubmit(prevState: any, formData: FormData) {
        console.dir(formData);
        // Implement the logic to handle the submitted prompt and includeThinking flag
    }

    return (
        <ChatContainerRoot >
            <Messages slug={slug} />


            <footer className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-transparent">
                <div className="max-w-4xl mx-auto relative">
                    <ScrollButton variant={"default"} className="absolute -top-16 left-1/2 -translate-x-1/2 z-30" />
                    <ChatPromptInput action={handleSubmit} />
                </div>
            </footer>


        </ChatContainerRoot>
    )
}