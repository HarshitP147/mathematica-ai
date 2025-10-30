'use client'

import type { KeyboardEvent } from "react"
import { useState } from "react"

import { ScrollToBottom } from "@/components/atom/scroll-to-bottom"
import SubmitButton from "@/components/atom/submit-button"
import { Textarea } from "@/components/ui/textarea"
import { SplineIcon } from "lucide-react"
import MarkDown from "react-markdown"
import Markdown from "react-markdown"


// import { handleChatAction } from "@/app/chat/actions"

export default function PromptInput() {

    const [prompt, setPrompt] = useState("")
    const [responseText, setResponseText] = useState("")

    const handlePromptSubmit = async (ev: any) => {
        ev.preventDefault()
        if (!prompt.trim()) return




        // Handle the chat action (e.g., send the prompt to the backend)
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ prompt }),
            headers: {
                'Content-Type': 'application/json'
            },
            keepalive: true,
        })
        setResponseText("")

        setPrompt("");


        if (!response.ok) {
            console.error("Failed to send prompt");
            return;
        }

        if (!response.body) {
            // Fallback to read full text if stream is not available
            const text = await response.text();
            setResponseText((prev) => prev + text);
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
                    setResponseText((prev) => prev + decoder.decode(value, { stream: true }));
                }
            }
        } finally {
            // ensure the reader is released
            try {
                reader.releaseLock();
            } catch {
                // ignore release errors
            }
        }
    }

    const handleKeyDown = (ev: KeyboardEvent<HTMLFormElement>) => {
        if (ev.key === 'Enter' && ev.ctrlKey) {
            handlePromptSubmit(ev);
        }
    }

    return (
        <>
            <div className="border bottom-4 h-96  w-full mb-10 p-4 overflow-auto text-sm text-muted-foreground">
                <Markdown>
                    {responseText}
                </Markdown>
            </div>

            <ScrollToBottom containerId="chat-messages-container" />
            <form onSubmit={handlePromptSubmit} onKeyDown={handleKeyDown}
                className="relative rounded-2xl border-2 border-border w-full dark:bg-white/5 backdrop-blur-md dark:backdrop-blur-[2px] shadow-lg"
            >
                <div className="flex items-center gap-2 p-3">
                    <Textarea
                        name="prompt"
                        placeholder="Ask something here..."
                        className="resize-none h-xl border-none "
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        rows={1}
                        onInput={e => {
                            const target = e.target as HTMLTextAreaElement
                            target.style.height = "auto"
                            target.style.height = `${Math.min(target.scrollHeight, 180)}px`
                        }}
                    />
                    {
                        responseText.length > 0 ?
                            <SubmitButton hasContent={true} />
                            :
                            <SplineIcon className="text-muted-foreground" />
                    }
                </div>

            </form>
        </>
    )
}