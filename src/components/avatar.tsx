import Image from "next/image";
import { CircleUserRound } from "lucide-react";

import { createClient } from "@/util/supabase/server"

import Menu from "@/components/menu";

export default async function Avatar() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

    return (
        <div className="flex flex-row items-center">
            <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            width={48}
                            height={48}
                            alt="User Avatar"
                            className="rounded-full"
                        />
                    ) : (
                        <CircleUserRound size={32} />
                    )}
                </button>
                <Menu />
            </div>
        </div>
    )
}
