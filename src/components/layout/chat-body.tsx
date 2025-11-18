'use client'
import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"

import { ChatContainerRoot } from "@/components/ui/chat-container"
import { ScrollButton } from "@/components/ui/scroll-button"
import ChatPromptInput from "@/components/layout/chat-prompt"
import Messages from "@/components/layout/messages"

import { createClient } from "@/util/supabase/client"

const supabase = createClient()

type ChatDataType = Array<{
    message_id: string;
    content: string;
    role: string;
    created_at: string;
}> | null;


export default function ChatBody() {
    const [msgList, setMsgList] = useState<ChatDataType>([]);
    const { slug } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialPromptSent = useRef(false);

    useEffect(() => {
        // Any client-side effects can be handled here

        supabase.from("messages")
            .select('message_id, content, role, created_at')
            .eq('chat_id', slug)
            .then(({ data, error }) => {
                if (error) {
                    console.error("Error loading messages:", error);
                } else {
                    setMsgList(data);
                }
            });

        return () => {
            setMsgList(null);
        }

    }, [slug]);

    async function streamResponse(prompt: string, includeThinking: boolean, chatId: string, skipUserMessage: boolean = false) {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: prompt,
                    includeThinking: includeThinking,
                    chatId: chatId,
                    messages: msgList,
                })
            });

            if (!response.ok) {
                console.error("Error submitting prompt:", response.statusText);
                return;
            }

            if (!response.body) {
                console.error("No response body");
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) {
                        const chunk = decoder.decode(value, { stream: true });
                        console.log(chunk);
                    }
                }
            } finally {
                try {
                    reader.releaseLock();
                } catch {
                    // ignore release errors
                }

                // Refresh messages from database after streaming completes
                setTimeout(async () => {
                    const { data, error } = await supabase
                        .from("messages")
                        .select('message_id, content, role, created_at')
                        .eq('chat_id', slug)
                        .order('messages(created_at)', { ascending: true });

                    if (!error && data) {
                        setMsgList(data);
                    }
                }, 1000);
            }
        } catch (err) {
            console.error("Error submitting prompt:", err);
        }
    }

    // Handle initial prompt from URL
    useEffect(() => {
        const initialPrompt = searchParams.get('initialPrompt');

        if (initialPrompt && !initialPromptSent.current && slug) {
            initialPromptSent.current = true;

            // Remove the query parameter from URL
            router.replace(`/chat/${slug}`, { scroll: false });

            // Send the initial prompt (skipUserMessage = true since it's already in DB)
            streamResponse(decodeURIComponent(initialPrompt), true, slug as string, true);
        }
    }, [searchParams, slug, router]);

    async function handleSubmit(prevState: any, formData: FormData) {
        const prompt = formData.get("prompt") as string;
        const includeThinking = formData.get("includeThinking") === "true";
        const chatId = formData.get("chatId") as string;

        await streamResponse(prompt, includeThinking, chatId, false);
    }


    return (
        <ChatContainerRoot >
            <Messages messageList={msgList} />


            <footer className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-transparent">
                <div className="max-w-4xl mx-auto relative">
                    <ScrollButton variant={"default"} className="absolute -top-16 left-1/2 -translate-x-1/2 z-30" />
                    <ChatPromptInput action={handleSubmit} />
                </div>
            </footer>


        </ChatContainerRoot>
    )
}