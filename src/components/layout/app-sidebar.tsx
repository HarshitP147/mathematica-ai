import Link from "next/link";
import { Plus } from "lucide-react";

import ChatList from "@/components/layout/chat-list";
import UserInfo from "@/components/atom/user-info";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function AppSidebar() {

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <UserInfo />
                <SidebarMenuButton asChild size="lg" className="w-full hover:bg-primary active:bg-primary/80">
                    <Link href="/">
                        <Plus className="h-5 w-5" />
                        <span>New Chat</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarHeader>


            <SidebarContent>
                <SidebarGroup className="flex-1">
                    <SidebarGroupContent className="h-full">
                        <ChatList />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

        </Sidebar>
    );
}