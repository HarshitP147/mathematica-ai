import Link from 'next/link';

import { createClient } from '@/util/supabase/server';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Empty, EmptyContent, EmptyTitle } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import ChatPromptInput from '@/components/layout/chat-prompt';

export default async function Home() {
    const supabase = createClient();

    let isSignedIn = (await supabase.auth.getUser()).data.user !== null;


    return (
        <>
            {(isSignedIn) && <SidebarTrigger className=" ml-3 justify-start hover:cursor-pointer p-4 rounded-full" />}
            <Empty>
                <EmptyContent>
                    <EmptyTitle>
                        <h1 className='text-4xl font-bold text-nowrap'>
                            Welcome to Mathematica AI!
                        </h1>
                    </EmptyTitle>
                    <p className='text-lg text-foreground'>Your AI chat assistant.</p>
                    {isSignedIn ? (
                        <div className='mb-4 w-[200%]'>
                            <ChatPromptInput />
                        </div>
                    ) : (
                        <Button asChild>
                            <Link href="/auth" className="btn btn-primary btn-lg mr-4">Login / Sign Up</Link>
                        </Button>
                    )}
                </EmptyContent>
            </Empty>
        </>
    )
}