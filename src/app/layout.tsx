import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Drawer from "@/components/drawer";
import Modal from "@/components/modal";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "PCM Chat - Your AI assistant for learning science",
    description: "AI assistant chat platform for learning science and beyond",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en" data-theme="dark" >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-row h-screen `}
            >
                <Drawer >
                    {children}
                </Drawer>

                <Modal />
            </body>
        </html>
    );
}
