import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./globals.css";

import Navbar from "@/components/navbar";

import { AuthProvider } from "@/context/AuthContext";

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
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                <AuthProvider>
                    <body
                        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
                    >
                        <Navbar />

                        {/* Add padding to prevent content from being hidden behind navbar */}
                        <main>
                            {children}
                        </main>
                    </body>
                </AuthProvider>
            </GoogleOAuthProvider>
        </html>
    );
}
