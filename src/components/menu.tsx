'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound } from "lucide-react"

import { createClient } from "@/util/supabase/client";

export default function Menu() {
    const supabase = createClient();

    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then((res => {
            if (res.data.user) {
                setUserLoggedIn(true);
                // Get avatar URL from user metadata (provided by Google OAuth)
                const avatarUrl = res.data.user.user_metadata?.avatar_url ||
                    res.data.user.user_metadata?.picture;
                setAvatarUrl(avatarUrl);
            } else {
                setUserLoggedIn(false);
                setAvatarUrl(null);
            }
        }))
    }, [supabase.auth]);


    return (
        <div className="dropdown ">
            <button tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                {userLoggedIn && avatarUrl ? (
                    <div className="w-10 rounded-full">
                        <Image
                            width={40}
                            height={40}
                            className="rounded-full"
                            alt="User avatar"
                            src={avatarUrl}
                        />
                    </div>
                )
                    :
                    <CircleUserRound size={32} />
                }
            </button>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                {userLoggedIn ? (
                    <>
                        <li><Link href="/" className="text-center">My Stories</Link></li>
                        <li>
                            <button className="text-error" onClick={() => document.getElementById('my_modal_2')!.showModal()}>Sign out</button>
                        </li>
                    </>
                ) : (
                    <li><Link href="/auth">Login / Sign Up</Link></li>
                )}
            </ul>
        </div >
    )
}