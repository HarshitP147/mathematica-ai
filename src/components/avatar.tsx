import Image from "next/image";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";

import { createClient } from "@/util/supabase/server"


export default async function Avatar() {

    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

    return (
        <div className="btn btn-ghost btn-circle avatar ">
            <Link href={"/settings"}>
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
            </Link>
        </div>

    )
}
