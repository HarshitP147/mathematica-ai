import Link from 'next/link';

import { createClient } from '@/util/supabase/server';


export default async function Home() {
    const supabase = createClient();

    let isSignedIn = (await supabase.auth.getUser()).data.user !== null;


    return (
        <div className="min-h-screen bg-gradient-to-bl from-accent via-secondary-content to-primary-content flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-4xl  font-bold mb-4">Welcome to Sceal AI</h1>
                <p className="text-lg text-gray-600 mb-6">Your AI-powered assistant for seamless communication.</p>
                {isSignedIn ? (
                    <Link href="/story" className="btn btn-primary btn-lg mr-4">Go to My Stories</Link>
                ) : (
                    <Link href="/auth" className="btn btn-primary btn-lg mr-4">Login / Sign Up</Link>
                )}
            </div>
        </div>
    )
}