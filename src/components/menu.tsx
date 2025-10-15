'use client'

import { useState } from "react";
import Link from "next/link";

import { createClient } from "@/util/supabase/client";

export default function Menu() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.role) {
            setIsUserLoggedIn(true);
        }
    });

    return (
        <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            {isUserLoggedIn ? (
                <>
                    <li><Link href="/" className="text-center">My Stories</Link></li>
                    <li>
                        <button className="text-error" onClick={() => (document.getElementById('modal') as HTMLDialogElement).showModal()}>Sign out</button>
                    </li>
                </>
            ) : (
                <li><Link href="/auth">Login / Sign Up</Link></li>
            )}
        </ul>
    )
}