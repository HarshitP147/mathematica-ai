
import { ChatContainerContent } from "@/components/ui/chat-container"
import { Message } from "@/components/ui/message"
import Response from "@/components/atom/response"

import { createClient } from "@/util/supabase/server"


export default async function Messages({ slug }: { slug?: string }) {
    const supabase = createClient()

    const { data: chatData, error } = await supabase.from("messages")
        .select('message_id, content, role, created_at')
        .eq('chat_id', slug);



    if (error) {
        return <div>Error loading messages: {error.message}</div>
    }

    return (
        <ChatContainerContent className="my-8 pb-36">
            {chatData && chatData.length > 0 ? (
                chatData.map((message) => (
                    <div
                        key={message.message_id}
                        className={`flex w-full px-20 ${message.role === "user" ? "justify-end" : "justify-center"}`}
                    >
                        {message.role === "user" ? (
                            <div className="group relative max-w-[75%] ml-auto">
                                <Message
                                    role="user"
                                    className="
                                            animate-in fade-in-50 slide-in-from-bottom-2 duration-300
                                            rounded-2xl px-4 py-3 shadow-sm
                                            bg-primary text-primary-foreground rounded-br-sm
                                            "
                                >
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        {message.content}
                                    </div>
                                </Message>
                            </div>
                        ) : (
                            <div className="group relative w-full ">
                                {/* AI Response (streaming) - Only show when streaming and not in DB yet */}
                                <Response content={message.content} isStreaming={true} />
                            </div>
                        )}
                    </div>

                ))
            ) : (
                <div>No messages yet.</div>
            )}

        </ChatContainerContent>
    )
}