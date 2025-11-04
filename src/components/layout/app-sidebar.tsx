import Link from "next/link";
import { Plus } from "lucide-react";

import Avatar from "@/components/atom/avatar";
import ChatList from "@/components/layout/chat-list";
import { createClient } from "@/util/supabase/server";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

export default async function AppSidebar() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex flex-row items-center py-4 px-4 justify-between">
                    <Link href="/" className="text-lg font-semibold">
                        {user?.user_metadata.full_name || "Mathematica AI"}
                    </Link>
                    <Avatar />
                </div>
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