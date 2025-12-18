'use client'
import { useState, useEffect, useRef, } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"

import { ChatContainerRoot } from "@/components/ui/chat-container"
import { ScrollButton } from "@/components/ui/scroll-button"
import ChatPromptInput from "@/components/layout/chat-prompt"
import Messages from "@/components/layout/messages"

import { createClient } from "@/util/supabase/client"

import { addMessageWithMediaAction } from "@/app/chat/actions"


const supabase = createClient()

type ChatMessage = {
    message_id: string;
    content: string;
    role: string;
    created_at: string;
    msg_media?: string[]; // Optional array of media IDs
};

type ChatDataType = Array<ChatMessage> | null;


export default function ChatBody() {
    const [msgList, setMsgList] = useState<ChatDataType>([]);
    const [streamingContent, setStreamingContent] = useState<string>("");
    const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);


    const { slug } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialPromptSent = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsWaitingForResponse(false);
        }
    };

    useEffect(() => {
        // Any client-side effects can be handled here

        supabase.from("messages")
            .select('message_id, content, role, created_at, msg_media')
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

    async function streamResponse(includeThinking: boolean, chatId: string) {
        setStreamingContent(""); // Clear previous streaming content
        setIsWaitingForResponse(true); // Show loading state until first chunk arrives

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal,
                body: JSON.stringify({
                    includeThinking: includeThinking,
                    chatId: chatId,
                    selectedModel: "gemini-2.5-pro",
                })
            });

            if (!response.ok) {
                console.error("Error submitting prompt:", response.statusText);
                setIsWaitingForResponse(false);
                return;
            }

            if (!response.body) {
                console.error("No response body");
                setIsWaitingForResponse(false);
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let hasReceivedChunk = false;

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) {
                        const chunk = decoder.decode(value, { stream: true });
                        setStreamingContent(prev => prev + chunk);
                        if (!hasReceivedChunk) {
                            hasReceivedChunk = true;
                            setIsWaitingForResponse(false); // First chunk received, stop showing loading
                        }
                    }
                }
            } finally {
                try {
                    reader.releaseLock();
                } catch {
                    // ignore release errors
                }

                if (!hasReceivedChunk) {
                    setIsWaitingForResponse(false); // Ensure loading state clears if stream ends with no chunks
                }

                // Refresh messages from database after streaming completes
                setTimeout(async () => {
                    const { data, error } = await supabase
                        .from("messages")
                        .select('message_id, content, role, created_at, msg_media')
                        .eq('chat_id', slug)

                    if (!error && data) {
                        setMsgList(data);
                        setStreamingContent(""); // Clear streaming content after loading from DB
                    }
                    setIsWaitingForResponse(false); // Ensure loading state is cleared after refresh attempt
                }, 1000);
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                console.log('Generation stopped by user');
                // Refresh messages to get any partial content that was saved
                const { data, error } = await supabase
                    .from("messages")
                    .select('message_id, content, role, created_at, msg_media')
                    .eq('chat_id', slug);
                if (!error && data) {
                    setMsgList(data);
                }
            } else {
                console.error("Error submitting prompt:", err);
            }
            setIsWaitingForResponse(false);
            setStreamingContent("");
        } finally {
            abortControllerRef.current = null;
        }
    }

    // Handle initial prompt from URL
    useEffect(() => {
        const includeThinkingParam = searchParams.get('includeThinking');
        const includeThinking = includeThinkingParam === 'true';

        if (!initialPromptSent.current && slug) {
            initialPromptSent.current = true;

            // Remove the query parameter from URL
            router.replace(`/chat/${slug}`, { scroll: false });

            // check if this is a new chat
            const isNewChat = searchParams.get('newChat') === 'true';
            if (isNewChat) {
                streamResponse(includeThinking, slug as string);
            }
            return; // Don't stream response for new chat creation
        }
    }, [searchParams, slug, router]);

    async function handleSubmit(prevState: any, formData: FormData) {
        const includeThinking = formData.get("includeThinking") === "true";
        const chatId = formData.get("chatId") as string;

        try {

            // Store message with media to database
            const { status } = await addMessageWithMediaAction(formData);

            if (status !== 201) {
                throw new Error("Failed to add message with media");
            }

            // Refresh messages immediately so the new prompt appears without a full reload
            const { data, error } = await supabase
                .from("messages")
                .select('message_id, content, role, created_at, msg_media')
                .eq('chat_id', chatId)
                .order('created_at', { ascending: true });

            if (!error && data) {
                setMsgList(data);
            }

            // Trigger a soft refresh to keep server components in sync
            router.refresh();

            // Start streaming the AI response
            setIsWaitingForResponse(true);
            try {

                await streamResponse(includeThinking, chatId);
            }
            catch (error) {
                console.error("Error streaming response:", error);
            }

            setTimeout(() => {
                setIsWaitingForResponse(false);
            }, 5000)

            // After successful storage, you can re-enable streaming if desired
            // await streamResponse(prompt, includeThinking, chatId, true);
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setIsWaitingForResponse(false);
        }
    }

    return (
        <ChatContainerRoot >
            <Messages messageList={msgList} streamingContent={streamingContent} isWaitingForResponse={isWaitingForResponse} />

            <footer className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-transparent">
                <div className="max-w-4xl mx-auto relative">
                    <ScrollButton variant={"default"} className="absolute -top-16 left-1/2 -translate-x-1/2 z-30" />
                    <ChatPromptInput
                        action={handleSubmit}
                        isStreaming={isWaitingForResponse || streamingContent.length > 0}
                        onStop={handleStopGeneration}
                    />
                </div>
            </footer>


        </ChatContainerRoot>
    )
}