'use client'

import Link from "next/link";
import { useParams } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export default function ChatLink(props: { chatId: string, name: string }) {

    const params = useParams();

    const isActive = params.slug === props.chatId;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                className={`transition-colors  active:bg-primary/80 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-background'} hover:bg-primary/80 hover:text-primary-foreground`}
            >
                <Link href={`/chat/${props.chatId}`} aria-current={isActive ? "page" : undefined}>
                    <span>{props.name}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}