import { Suspense } from "react";
import { MessageSquare } from "lucide-react";

import ChatList from "./chat-list";
import { SidebarMenu } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

import { createClient } from "@/util/supabase/server";



type ChatInfoType = {
	chat_name: string,
	updated_at: string
}

export default async function ChatsContent() {
	const supabase = createClient();

	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (!userData) {
		return
	}

	const { data: chatData, error } = await supabase.from("user_chats").select(`chat_id,
			chats (
				chat_name,
				updated_at
				)
			`).eq('user_id', userData.user!.id).order("chats(updated_at)", { ascending: false });

	if (error) {
		console.error("Error fetching chats:", error);
		return;
	}


	// flatten the data to match ChatList expected props
	const chats = chatData?.map((item) => ({
		chat_id: item.chat_id as string,
		chat_info: ((Array.isArray(item.chats) ? item.chats[0] : item.chats) ?? { chat_name: "", updated_at: "" }) as ChatInfoType
	}));



	return (
		<SidebarMenu className="gap-1">
			<Suspense fallback={<Spinner className="mx-auto my-8" />}>
				{!chatData || chatData.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
						<MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />
						<div className="space-y-1">
							<p className="text-sm font-medium text-foreground">No chats yet</p>
							<p className="text-xs text-muted-foreground">
								Start a new conversation to get started
							</p>
						</div>
					</div>
				) :
					<ChatList list={chats} />
				}
			</Suspense>
		</SidebarMenu>
	)
}
