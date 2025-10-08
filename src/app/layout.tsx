import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Sceal AI",
    description: "Platform for storytelling and narration with AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="forest">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased `}
            >
                {/* Fixed Navbar */}
                <div className="fixed mt-4  top-4 -translate-x-1/2 left-[50%] w-[60%] z-50">
                    <nav className="navbar bg-transparent backdrop-blur-xl rounded-box px-6 shadow-lg">
                        <div className="navbar-start ">
                            <Link href="/" className="normal-case text-xl">
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
                            <Link href="/" className="text-base-content">
                                Settings
                            </Link>
                        </div>
                    </nav>
                </div>
                {/* Add padding to prevent content from being hidden behind navbar */}
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
