'use client'

import Image from "next/image";
import { createClient } from "@/util/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"

export default function Page() {
    const supabase = createClient()

    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` : `${window.location.origin}/auth/callback`;

    const handleGoogleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                scopes: 'openid email profile',
            },
        })

        if (error) {
            console.error("Error during Google OAuth sign-in:", error);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-background via-muted/20 to-background p-4">

            <Card className="w-full max-w-md border-border/60 shadow-2xl backdrop-blur-sm">
                <CardHeader className="space-y-3 text-center pb-6">
                    <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        Welcome to Mathematica AI
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        Sign in to unlock powerful AI conversations and insights
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full gap-3 cursor-pointer border-[#E0E0E0] bg-[#F2F2F2] transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={handleGoogleLogin}
                    >
                        <Image
                            src="/google.svg"
                            alt="Google"
                            width={32}
                            height={32}
                        />
                        <span className="font-medium">Continue with Google</span>
                    </Button>

                </CardContent>
            </Card>
        </div >
    )
}