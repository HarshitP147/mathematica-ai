'use client'

import Image from "next/image";
import { createClient } from "@/util/supabase/client"

export default function Page() {

    const supabase = createClient()

    const handleGoogleLogin = () => {
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/auth/callback',
                scopes: 'openid email profile',
            },
        }).then(({ error }) => {
            if (error) {
                console.error("Error during Google OAuth sign-in:", error);
            } else {
                console.log("Redirecting to Google for authentication...");
            }
        });
    }



    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-3xl font-bold mb-2">Welcome to Sceal AI</h2>
                    <p className="text-base-content/70 mb-6">Sign in to start creating amazing stories</p>

                    <div className="card-actions w-full">
                        <button
                            className="btn btn-lg w-full bg-white hover:bg-gray-50 text-black border border-gray-300 gap-3 normal-case shadow-sm"
                            onClick={handleGoogleLogin}
                        >
                            <Image
                                src="/google.svg"
                                alt="Google"
                                width={32}
                                height={32}
                            />
                            <span className="text-base font-medium">Continue with Google</span>
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
}