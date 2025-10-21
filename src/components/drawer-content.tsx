import Link from "next/link";
import { CircleFadingPlus } from "lucide-react";

import Avatar from "@/components/avatar";
import ChatList from "@/components/chat-list";

export default function DrawerContent() {
    return (
        <div className="drawer-side border-r  border-white/20">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <aside className="bg-base-100 min-h-full w-80 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-base-100">

                    <div className="border-b">
                        <div className="flex flex-row items-center py-4 px-4 justify-between">
                            <Link href="/" className="text-2xl font-semibold">
                                PCM Chat
                            </Link>
                            <Avatar />
                        </div>
                    </div>

                    {/* New Chat Button */}
                    <div className="px-4 pt-6">
                        <Link href={"/"} className="btn btn-primary w-full text-white rounded-lg normal-case text-base">
                            <CircleFadingPlus className="mr-2 h-5 w-5" />
                            New Chat
                        </Link>
                    </div>

                    <div className="divider px-4"></div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-scroll px-4 pb-4">
                    <ChatList />
                </div>
            </aside>
        </div>

    )
}