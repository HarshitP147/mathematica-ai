
'use client'
import { motion, AnimatePresence } from "motion/react"

import { ChatContainerContent } from "@/components/ui/chat-container"
import Response from "@/components/atom/response"
import { Loader } from "@/components/ui/loader"

import { createClient } from "@/util/supabase/client"
import Prompt from "../atom/prompt"


type ChatDataType = Array<{
    message_id: string;
    content: string;
    role: string;
    created_at: string;
    msg_media?: string[]; // Optional array of media IDs
}> | null;

const supabase = createClient()

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
                                    <Prompt message={message} />
                                ) : (
                                    <div className="group relative w-full">
                                        <Response content={message.content} isStreaming={false} />
                                    </div>
                                )}
                            </motion.div>
                        ))}

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