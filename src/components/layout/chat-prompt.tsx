'use client'

import type { KeyboardEvent } from "react"
import { useState, useActionState, startTransition } from "react"
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
    action?: (prevState: any, formData: FormData) => Promise<any>
}


export default function ChatPromptInput(props: Props) {
    const [prompt, setPrompt] = useState("");
    const [includeThinking, setIncludeThinking] = useState(false);
    const { slug } = useParams();

    const [state, formAction, pending] = useActionState(props.action!, { prompt, slug, includeThinking });

    async function handleSubmit(event?: React.FormEvent) {
        event?.preventDefault();

        // let chatId = slug ?? '/';

        // if (chatId === '/') {
        //     try {
        //         const response = await fetch("/api/index", {
        //             method: "POST",
        //             body: JSON.stringify({ prompt: prompt }),
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             }
        //         });

        //         if (!response.ok) {
        //             throw new Error("Failed to create chat");
        //         }

        //         const data = await response.json();

        //         const currentPrompt = prompt;
        //         setPrompt("");

        //         // Redirect to the new chat page - the message is already in DB
        //         // Pass initialPrompt only to trigger AI response, not to create duplicate
        //         router.push(`/chat/${data.chatId}?initialPrompt=${encodeURIComponent(currentPrompt)}`);

        //         // Refresh to update the chat list in the sidebar
        //         router.refresh();
        //     } catch (error) {
        //         console.error(error);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }

        // else {
        //     try {
        //         await props.sendPrompt!(prompt, includeThinking);
        //         setPrompt("");
        //     } catch (error) {
        //         console.error(error);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }

        // props.action!({ prompt, slug, includeThinking })

    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            startTransition(() => {
                const form = event.currentTarget.form;
                if (form) {
                    const formData = new FormData(form);
                    formAction(formData);
                }
            });
        }
    }

    return (
        <form action={formAction}>

            <PromptInput
                className="w-full bg-transparent backdrop-blur-lg dark:backdrop-blur-3xl  "
                value={prompt}
                onSubmit={undefined}  // Disable built-in Enter submit
                isLoading={pending}
            >


                <PromptInputTextarea
                    placeholder="Ask me anything..."
                    onKeyDown={handleKeyDown}
                    name="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="text-foreground dark:bg-transparent dark:backdrop-blur-3xl" />


                <PromptInputActions className="w-full items-center justify-between ">

                    <div className="space-x-2">

                        <PromptInputAction tooltip={"Attach files"} >
                            <Button variant={"outline"} className="rounded-full p-2">
                                <Paperclip className="text-foreground  " />
                            </Button>
                        </PromptInputAction>

                        <PromptInputAction tooltip={"Toggle Thinking"} >
                            <Button variant={includeThinking ? "default" : "outline"} className="rounded-full p-2.5" onClick={() => setIncludeThinking(!includeThinking)}>
                                <IncludeThinking includeThinking={includeThinking} />
                            </Button>
                        </PromptInputAction>
                    </div>



                    <PromptInputAction className="justify-end" tooltip={false}>
                        <SubmitButton
                            isLoading={pending}
                            hasContent={prompt.trim().length !== 0}
                        />
                    </PromptInputAction>
                </PromptInputActions>

            </PromptInput>
        </form>
    )
}