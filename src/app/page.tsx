import { redirect } from 'next/navigation';

import { createClient } from '@/util/supabase/server';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Empty, EmptyContent, EmptyTitle } from '@/components/ui/empty';
import ChatPromptInput from '@/components/layout/chat-prompt';

import { createNewChatAction } from './actions';

export default async function Home() {
    const supabase = createClient();

    // server-side check for authenticated user
    let isSignedIn = (await supabase.auth.getUser()).data.user !== null;

    if(!isSignedIn) {
        redirect('/auth');
    }


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
                    <div className='mb-4 w-[200%]'>
                        <ChatPromptInput action={createNewChatAction} />
                    </div>
                </EmptyContent>
            </Empty>
        </>
    )
}