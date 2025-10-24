import Link from 'next/link';

import { createClient } from '@/util/supabase/server';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { PromptInput } from '@/components/layout/prompt-input';

export default async function Home() {
    const supabase = createClient();

    let isSignedIn = (await supabase.auth.getUser()).data.user !== null;


    return (
        <div className='h-full'>
            <SidebarTrigger className=" ml-3 justify-start hover:cursor-pointer p-4 rounded-full" />
            <div className="text-center mt-[5%] ">

                <h1 className="text-4xl  font-bold mb-4">Welcome to PCM Chat!</h1>
                <p className="text-lg text-gray-600 mb-6">Your AI-powered assistant for seamless communication.</p>
                {isSignedIn ? (
                    <div className="flex justify-center w-3/5 mx-auto gap-4">
                        <PromptInput />
                    </div>
                    ) : (
                    <Link href="/auth" className="btn btn-primary btn-lg mr-4">Login / Sign Up</Link>
                )}
            </div>
        </div>
    )
}