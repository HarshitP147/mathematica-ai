import Link from "next/link";

import Avatar from "@/components/avatar";


export default function Navbar() {

    return (
        <div className="fixed mt-4  top-4 -translate-x-1/2 left-[50%] w-[60%] z-50">
            <nav className="navbar border border-neutral bg-transparent backdrop-blur-xl rounded-box px-6 shadow-lg">
                <div className="navbar-start ">
                    <Link href="/" className="normal-case text-xl font-semibold">
                        Sceal AI
                    </Link>
                </div>
                <div className="navbar-center hidden">
                    <div className="menu menu-horizontal px-1">
                        <Link href="/about" className="text-base-content">
                            About
                        </Link>
                    </div>
                </div>
                <div className="navbar-end">
                    <Avatar />
                </div>
            </nav>
        </div>
    )
}