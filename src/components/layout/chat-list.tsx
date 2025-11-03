import ChatLink from "@/components/atom/chat-link";
import { SidebarMenu } from "@/components/ui/sidebar";
import { MessageSquare } from "lucide-react";

import { createClient } from "@/util/supabase/server";


export default async function ChatList() {
	const supabase = createClient();

	const chats = await supabase.from("chats").select("chat_id, chat_name");

	return (
		<SidebarMenu className="gap-1">
			{!chats.data || chats.data.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
					<MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />
					<div className="space-y-1">
						<p className="text-sm font-medium text-foreground">No chats yet</p>
						<p className="text-xs text-muted-foreground">
							Start a new conversation to get started
						</p>
					</div>
				</div>
			) : (
				chats.data.map((chat) => {
					return <ChatLink key={chat.chat_id} chatId={chat.chat_id} name={chat.chat_name} />;
				})
			)}
		</SidebarMenu>
	)
}
