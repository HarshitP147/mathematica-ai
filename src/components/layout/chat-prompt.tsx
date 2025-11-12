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
import IncludeThinking from "@/components/atom/include-thinking"
import SubmitButton from "@/components/atom/submit-button"
import { Button } from "@/components/ui/button"
import { Paperclip } from "lucide-react"

type Props = {
    loading?: boolean,
    sendPrompt?: (prompt: string) => Promise<void>
}


export default function ChatPromptInput(props: Props) {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(props.loading || false);
    const [includeThinking, setIncludeThinking] = useState(false);
    const { slug } = useParams();
    const router = useRouter();

    function handleValueChange(value: string) {
        setPrompt(value);
    }

    async function handleSubmit(event?: React.FormEvent) {
        event?.preventDefault();
        setIsLoading(true);

        let chatId = slug ?? '/';

        if (chatId === '/') {
            try {
                const response = await fetch("/api/index", {
                    method: "POST",
                    body: JSON.stringify({ prompt: prompt }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to create chat");
                }

                const data = await response.json();

                const currentPrompt = prompt;
                setPrompt("");

                // Redirect to the new chat page - the message is already in DB
                // Pass initialPrompt only to trigger AI response, not to create duplicate
                router.push(`/chat/${data.chatId}?initialPrompt=${encodeURIComponent(currentPrompt)}`);

                // Refresh to update the chat list in the sidebar
                router.refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        else {
            try {
                await props.sendPrompt!(prompt);
                setPrompt("");
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
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
            className="w-full  bg-transparent backdrop-blur-lg dark:backdrop-blur-3xl  "
            value={prompt}
            onSubmit={undefined}  // Disable built-in Enter submit
            isLoading={isLoading}
            onValueChange={handleValueChange}
        >


            <PromptInputTextarea
                placeholder="Ask me anything..."
                onKeyDown={handleKeyDown}
                className="text-foreground bg-transparent " />


            <PromptInputActions className="w-full items-center justify-between ">

                <div className="space-x-2">

                    <PromptInputAction tooltip={"Attach files"} >
                        <Button variant={"outline"} className="rounded-full p-2">
                            <Paperclip className="text-foreground  " />
                        </Button>
                    </PromptInputAction>

                    <PromptInputAction tooltip={"Toggle Thinking"} >
                        <Button variant={"ghost"} className="rounded-full p-2" onClick={() => setIncludeThinking(!includeThinking)}>
                            <IncludeThinking includeThinking={includeThinking} />
                        </Button>
                    </PromptInputAction>
                </div>



                <PromptInputAction className="justify-end" tooltip={false}>
                    <Button asChild>
                        <SubmitButton
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            hasContent={prompt.trim().length !== 0}
                        />
                    </Button>
                </PromptInputAction>
            </PromptInputActions>

        </PromptInput>
    )
}