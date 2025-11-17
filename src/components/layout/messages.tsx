
import { ChatContainerContent } from "@/components/ui/chat-container"
import { Message } from "@/components/ui/message"
import Response from "@/components/atom/response"



type ChatDataType = Array<{
    message_id: string;
    content: string;
    role: string;
    created_at: string;
}> | null;



export default function Messages({ messageList }: { messageList?: ChatDataType }) {



    return (
        <ChatContainerContent className="my-8 pb-36">
            {messageList && messageList.length > 0 ? (
                messageList.map((message) => (
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