
import { ChatContainerContent } from "@/components/ui/chat-container"
import { Message } from "@/components/ui/message"
import Response from "@/components/atom/response"
import { Loader } from "@/components/ui/loader"


type ChatDataType = Array<{
    message_id: string;
    content: string;
    role: string;
    created_at: string;
}> | null;


export default function Messages({ messageList, streamingContent, isWaitingForResponse }: { messageList?: ChatDataType, streamingContent?: string, isWaitingForResponse: boolean }) {

    return (
        <ChatContainerContent className="my-8 pb-36">
            {messageList && messageList.length > 0 ? (
                <>
                    {messageList.map((message) => (
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
                                    <Response content={message.content} isStreaming={false} />
                                </div>
                            )}
                        </div>
                    ))}


                    {isWaitingForResponse && !streamingContent && (
                        <div className="flex justify-center px-6">
                            <div className="mt-6 flex w-full max-w-xl items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 px-5 py-4 text-sm text-muted-foreground shadow-sm">
                                <Loader variant="typing" size="md" />
                                <div className="leading-tight">
                                    <p className="font-medium text-foreground">Mathematica AI is thinking…</p>
                                    <p className="text-xs text-muted-foreground">Waiting for the first response chunk</p>
                                </div>
                            </div>
                        </div>
                    )}


                    {streamingContent && streamingContent.length > 0 && (
                        <div className="flex w-full px-20 justify-center">
                            <div className="group relative w-full">
                                <Response content={streamingContent} isStreaming={true} />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            )}

        </ChatContainerContent>
    )
}