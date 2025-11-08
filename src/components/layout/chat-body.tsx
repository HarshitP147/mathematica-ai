'use client'
import { useState } from "react";

import ResponseExample from "@/components/atom/response-example";
import { ChatContainerContent, ChatContainerRoot } from "@/components/ui/chat-container";
import ChatPromptInput from "@/components/layout/chat-prompt";

export default function ChatBody() {
    const [loading, setIsLoading] = useState(false);

    async function handleSendPrompt(prompt: string) {
        setIsLoading(true);

        // Handle the chat action (e.g., send the prompt to the backend)
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ prompt }),
            headers: {
                'Content-Type': 'application/json'
            },
            keepalive: true,
        })


        if (!response.ok) {
            console.error("Failed to send prompt");
            setIsLoading(false);
            return;
        }

        if (!response.body) {
            // Fallback to read full text if stream is not available
            const text = await response.text();
            console.log("Response text:", text);
            setIsLoading(false);
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    // value is a Uint8Array
                    console.log(decoder.decode(value, { stream: true }));
                }
            }
        } finally {
            // ensure the reader is released
            try {
                reader.releaseLock();
            } catch {
                // ignore release errors
            }
            setIsLoading(false);
        }
    }



    return (
        <>

            <ChatContainerRoot>
                <ChatContainerContent>
                    <ResponseExample />
                </ChatContainerContent>
            </ChatContainerRoot>

            <footer className="fixed bottom-0 left-0 right-0 px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    <ChatPromptInput loading={loading} sendPrompt={handleSendPrompt} />
                </div>
            </footer>
        </>
    );
}