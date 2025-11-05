import Link from "next/link"

import Settings from "@/components/layout/settings";
import Avatar from "@/components/atom/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { createClient } from "@/util/supabase/server";

export default async function UserInfo() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <Dialog>
            <DialogTrigger className=" hover:cursor-pointer">
                <div className="flex flex-row items-center py-4 px-4 justify-between">
                    <div className="text-lg font-semibold">
                        {user?.user_metadata.full_name || "Mathematica AI"}
                    </div>
                    <Avatar />
                </div>
            </DialogTrigger>
            <Settings />
        </Dialog>
    )

}