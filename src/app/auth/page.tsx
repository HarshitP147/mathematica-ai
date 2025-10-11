'use client'


import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, } from "@react-oauth/google";

import AuthContext from "@/context/AuthContext";
import { createClient } from "@/util/supabase/client";


export default function Page() {
    const { googleSignIn } = useContext(AuthContext);
    const router = useRouter();
    const supabase = createClient();
    const [isChecking, setIsChecking] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                // User is already logged in, redirect to home
                router.replace('/');
            } else {
                setIsChecking(false);
            }
        });
    }, [supabase.auth, router]);

    const handleAppleSignIn = () => {
        // Add your Apple sign-in logic here
        console.log('Apple sign-in clicked');
    };

    // Show loading while checking auth status
    if (isChecking) {
        return (
            <main className="flex min-h-screen bg-primary-content flex-col items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen bg-primary-content flex-col items-center justify-center p-24">
            <div className="card w-96 bg-base-100 shadow-xl">
                {/* Authentication card comes here */}
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
                        Welcome to Sceal AI
                    </h2>
                    <p className="text-center text-base-content/70 mb-6">
                        Sign in to continue your storytelling journey
                    </p>

                    <div className="space-y-8">
                        {/* Apple Sign In Button */}
                        <button
                            onClick={handleAppleSignIn}
                            className="btn btn-lg w-full bg-black text-white border-black hover:bg-gray-900"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 16 16">
                                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
                                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
                            </svg>
                            Sign in with Apple
                        </button>

                        {/* Google Sign In Button */}
                        <GoogleLogin onSuccess={googleSignIn} />
                    </div>

                </div>
            </div>
        </main>
    );
}