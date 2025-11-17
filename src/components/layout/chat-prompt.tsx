'use client'

import type { KeyboardEvent } from "react"
import { useState, useActionState, startTransition, useEffect } from "react"
import { useParams, } from "next/navigation"

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

    let promptAction;

    if (props.action) {
        promptAction = props.action;
    }

    const [state, formAction, pending] = useActionState(promptAction!, { prompt: "", includeThinking: false });

    // async function handleSubmit(event?: React.FormEvent) {
    //     event?.preventDefault();

    //     // let chatId = slug ?? '/';
    //     // else {
    //     //     try {
    //     //         await props.sendPrompt!(prompt, includeThinking);
    //     //         setPrompt("");
    //     //     } catch (error) {
    //     //         console.error(error);
    //     //     } finally {
    //     //         setIsLoading(false);
    //     //     }
    //     // }
    // }

    async function handleSubmit(event: React.FormEvent) {
        event?.preventDefault();

        if (prompt.length === 0) {
            return;
        }

        const chatId = slug ?? "/";

        // console.log(chatId);
        startTransition(() => {
            // @ts-ignore
            const form = (event.currentTarget.form);
            // append the chatId to the form data if it exists

            if (form) {
                const formData = new FormData(form);
                formData.append("chatId", chatId as string)
                formAction(formData);
            }
        });
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
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

                        <input type="hidden" name="includeThinking" value={includeThinking ? "true" : "false"} />
                        <PromptInputAction tooltip={"Toggle Thinking"} >
                            <Button name="includeThinking" variant={includeThinking ? "default" : "outline"} type={"button"} className="rounded-full p-2.5" onClick={() => setIncludeThinking(!includeThinking)}>
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