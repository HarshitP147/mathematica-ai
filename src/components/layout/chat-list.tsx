'use client'

import { AnimatePresence } from "motion/react"

import ChatLink from "@/components/atom/chat-link"
import { AlertDialog } from "@/components/ui/alert-dialog"

interface Chat {
    chat_id: string,
    chat_info: {
        chat_name: string
        updated_at: string
    }
};


export default function ChatList({ list }: { list: Chat[] }) {
    return (
        <AlertDialog>
            <AnimatePresence mode="sync">
                {list.map((chat) => {
                    return <ChatLink key={chat.chat_id} chatId={chat.chat_id} name={chat.chat_info.chat_name} />;
                })}
            </AnimatePresence>
        </AlertDialog>
    )
}