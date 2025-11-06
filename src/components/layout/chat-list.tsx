'use client'

import { AnimatePresence } from "motion/react"

import ChatLink from "@/components/atom/chat-link"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogAction, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel } from "@/components/ui/alert-dialog"


export default function ChatList({ list }: { list: any[] }) {
    return (
        <AlertDialog>
            <AnimatePresence initial={false} mode="popLayout">
                {list.map((chat) => {
                    return <ChatLink key={chat.chat_id} chatId={chat.chat_id} name={chat.chat_name} />;
                })}
            </AnimatePresence>           
        </AlertDialog>
    )
}