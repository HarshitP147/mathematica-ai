'use client'

import type { KeyboardEvent } from "react"
import { useState } from "react"
import { useParams, useRouter, } from "next/navigation"

import {
    PromptInput,
    PromptInputTextarea,
    PromptInputActions,
    PromptInputAction
} from "@/components/ui/prompt-input"
import SubmitButton from "@/components/atom/submit-button"
import { Button } from "@/components/ui/button"


export default function ChatPromptInput({ onPromptSubmit }: { onPromptSubmit?: () => void }) {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { slug } = useParams();
    const router = useRouter();

    function handleValueChange(value: string) {
        setPrompt(value);
    }

    async function handleSubmit(event?: React.FormEvent) {
        event?.preventDefault();
        setIsLoading(true);

        onPromptSubmit!();

        let chatId = slug ?? '/';

        console.log(chatId)
        console.log(prompt);

        setIsLoading(false);
        setPrompt("");

        // try {

        //     const response = await fetch("/api/index", {
        //         method: "POST",
        //         body: JSON.stringify({ prompt: prompt }),
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });

        //     if (!response.ok) {
        //         throw new Error("Failed to create chat");
        //     } 

        //     const data = await response.json();
        //     console.log(data);

        //     setPrompt("");

        //     // Redirect to the new chat page
        //     router.push(`/chat/${data.chatId}`);

        //     // Refresh to update the chat list in the sidebar
        //     router.refresh();
        // } catch (error) {
        //     console.error(error);
        // } finally {
        //     setIsLoading(false);
        // }


        // // Handle the chat action (e.g., send the prompt to the backend)
        // const response = await fetch('/api/chat', {
        //     method: 'POST',
        //     body: JSON.stringify({ prompt }),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     keepalive: true,
        // })

        // setPrompt("");


        // if (!response.ok) {
        //     console.error("Failed to send prompt");
        //     setIsLoading(false);
        //     return;
        // }

        // if (!response.body) {
        //     // Fallback to read full text if stream is not available
        //     const text = await response.text();
        //     console.log("Response text:", text);
        //     setIsLoading(false);
        //     return;
        // }

        // const reader = response.body.getReader();
        // const decoder = new TextDecoder();

        // try {
        //     while (true) {
        //         const { done, value } = await reader.read();
        //         if (done) break;
        //         if (value) {
        //             // value is a Uint8Array
        //             console.log(decoder.decode(value, { stream: true }));
        //         }
        //     }
        // } finally {
        //     // ensure the reader is released
        //     try {
        //         reader.releaseLock();
        //     } catch {
        //         // ignore release errors
        //     }
        //     setIsLoading(false);
        // }

    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && event.ctrlKey) {
            event.preventDefault();
            handleSubmit();
        }
        // Enter without Shift or Ctrl does nothing (no preventDefault needed)
    }

    return (
        <PromptInput
            className="w-full flex bg-transparent backdrop-blur-lg dark:backdrop-blur-3xl"
            value={prompt}
            onSubmit={undefined}  // Disable built-in Enter submit
            isLoading={isLoading}
            onValueChange={handleValueChange}
        >
            <PromptInputTextarea
                placeholder="Ask me anything..."
                onKeyDown={handleKeyDown}
                className="text-foreground bg-transparent" />
            <PromptInputActions>
                <PromptInputAction className="justify-end" tooltip={false}>
                    <Button asChild onClick={onPromptSubmit}>
                        <SubmitButton isLoading={isLoading} hasContent={prompt.trim().length !== 0} />
                    </Button>
                </PromptInputAction>
            </PromptInputActions>
        </PromptInput>
    )
}