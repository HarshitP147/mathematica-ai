import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import "./globals.css";

import AppSidebar from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/context/theme-provider";

import { createClient } from "@/util/supabase/server";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "PCM Chat - Your AI assistant for learning science",
    description: "AI assistant chat platform for learning science and beyond",
};



export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = createClient();

    // server-side check for authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isSignedIn = !!user;

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistMono.className}  antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SidebarProvider>
                        {isSignedIn && <AppSidebar />}
                        <SidebarInset className="h-screen overflow-hidden relative">
                            {children}
                        </SidebarInset>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
