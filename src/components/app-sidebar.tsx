import Link from "next/link";
import { Plus } from "lucide-react";

import Avatar from "@/components/avatar";
import ChatList from "@/components/chat-list";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex flex-row items-center py-4 px-4 justify-between">
                    <Link href="/" className="text-2xl font-semibold">
                        PCM Chat
                    </Link>
                    <Avatar />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild size="lg" className="w-full hover:bg-primary active:bg-primary/80">
                                    <Link href="/">
                                        <Plus className="h-5 w-5" />
                                        <span>New Chat</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup className="flex-1">
                    <SidebarGroupContent className="h-full">
                        <ChatList />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

        </Sidebar>
    );
}