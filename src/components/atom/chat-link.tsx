'use client'

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Trash } from "lucide-react";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import DeleteAlert from "@/components/atom/delete-alert";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from "@/components/ui/sidebar";


export default function ChatLink(props: { chatId: string, name: string }) {

    const params = useParams();

    const isActive = params.slug === props.chatId;

    return (
        <SidebarMenuItem>
            <motion.div
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{
                    layout: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        mass: 0.8
                    },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 }
                }}
                className="group/item"
            >
                <SidebarMenuButton
                    asChild
                    className={`transition-colors  active:bg-primary/80 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-background'} hover:bg-primary/80 hover:text-primary-foreground`}
                >
                    <Link href={`/chat/${props.chatId}`} aria-current={isActive ? "page" : undefined}>
                        <span>{props.name}</span>
                    </Link>
                </SidebarMenuButton>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <SidebarMenuAction
                            showOnHover
                            className="data-[state=open]:opacity-100"
                        >
                            <Trash className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete chat</span>
                        </SidebarMenuAction>
                    </AlertDialogTrigger>
                    <DeleteAlert chatName={props.name} chatId={props.chatId} />
                </AlertDialog>
            </motion.div>
        </SidebarMenuItem>
    )
}