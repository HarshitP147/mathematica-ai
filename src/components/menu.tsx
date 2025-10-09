'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound } from "lucide-react"

import { createClient } from "@/util/supabase/client";

export default function Menu() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const supabase = createClient();

    // check if user is logged in
    useEffect(() => {
        const getUser = async () => {
            const { data: user } = await supabase.auth.getUser();
            if (user.user) {
                setUserLoggedIn(true);
            } else {
                setUserLoggedIn(false);
            }
        }
        getUser();
    }, [supabase.auth]);

    return (
        <div className="dropdown ">
            <button tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                {userLoggedIn ? (
                    <Image
                        fill
                        className="rounded-full w-14"
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                )
                    :
                    <CircleUserRound size={32} />
                }
            </button>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                {userLoggedIn ? (
                    <li><Link href="/">My Stories</Link></li>
                ) : (
                    <li><Link href="/auth">Login / Sign Up</Link></li>
                )}
            </ul>
        </div >
    )
}