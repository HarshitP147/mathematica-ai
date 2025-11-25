
'use client'

import { ChatContainerContent } from "@/components/ui/chat-container"
import { Message } from "@/components/ui/message"
import Response from "@/components/atom/response"
import { Loader } from "@/components/ui/loader"
import { motion, AnimatePresence } from "motion/react"


type ChatDataType = Array<{
    message_id: string;
    content: string;
    role: string;
    created_at: string;
}> | null;


export default function Messages({ messageList, streamingContent, isWaitingForResponse }: { messageList?: ChatDataType, streamingContent?: string, isWaitingForResponse: boolean }) {

    return (
        <ChatContainerContent className="my-8 pb-36">
            <AnimatePresence mode="popLayout" initial={false}>
                {messageList && messageList.length > 0 ? (
                    <div key="messages-container">
                        {messageList.map((message, index) => (
                            <motion.div
                                key={message.message_id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                    duration: 0.35,
                                    ease: [0, 0.3772, 0.8604, 1]
                                }}
                                layout
                                className={`flex w-full px-4 sm:px-8 md:px-20 ${message.role === "user" ? "justify-end" : "justify-center"}`}
                            >
                                {message.role === "user" ? (
                                    <div className="group relative max-w-[85%] sm:max-w-[75%] my-3 ml-auto flex items-end gap-2">
                                        <Message
                                            role="user"
                                            className="
                                                rounded-2xl px-4 py-3 shadow-md
                                                bg-primary text-primary-foreground rounded-br-md
                                                hover:shadow-lg transition-shadow duration-200
                                                "
                                        >
                                            <div className="prose prose-sm prose-invert max-w-none leading-relaxed">
                                                {message.content}
                                            </div>
                                        </Message>
                                        {/* <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            {/* <User className="h-4 w-4" /> */}
                                        {/* </div> */} 
                                    </div>
                                ) : (
                                    <div className="group relative w-full">
                                        <Response content={message.content} isStreaming={false} />
                                    </div>
                                )}
                            </motion.div>
                        ))}


                        {isWaitingForResponse && !streamingContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex justify-center px-4 sm:px-6"
                            >
                                <div className="mt-4 flex w-full max-w-xl items-center gap-4 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm px-5 py-4 text-sm text-muted-foreground shadow-lg">
                                    <Loader variant="typing" size="md" />
                                    <div className="leading-tight">
                                        <p className="font-medium text-foreground">Mathematica AI is thinking…</p>
                                        <p className="text-xs text-muted-foreground">Waiting for the first response</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}


                        {streamingContent && streamingContent.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex w-full px-4 sm:px-8 md:px-20 justify-center"
                            >
                                <div className="group relative w-full">
                                    <Response content={streamingContent} isStreaming={true} />
                                </div>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center h-full text-muted-foreground"
                    >
                        <p>No messages yet. Start the conversation!</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </ChatContainerContent>
    )
}