'use client'

import type { KeyboardEvent } from "react"
import { useState, useActionState, startTransition } from "react"
import { useParams } from "next/navigation"
import { Paperclip, X } from "lucide-react"

import {
    PromptInput,
    PromptInputTextarea,
    PromptInputActions,
    PromptInputAction
} from "@/components/ui/prompt-input"
import {
    FileUpload,
    FileUploadTrigger,
    FileUploadContent
} from "@/components/ui/file-upload"
import IncludeThinking from "@/components/atom/include-thinking"
import SubmitButton from "@/components/atom/submit-button"
import { Button } from "@/components/ui/button"

type Props = {
    action?: (prevState: any, formData: FormData) => Promise<any>
    isStreaming?: boolean
    onStop?: () => void
}


export default function ChatPromptInput(props: Props) {
    const [prompt, setPrompt] = useState("");
    const [includeThinking, setIncludeThinking] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const { slug } = useParams();

    const [state, formAction, pending] = useActionState(props.action!, { prompt: "", includeThinking: false });

    const handleFilesAdded = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    async function handleSubmit(event: React.FormEvent) {
        event?.preventDefault();

        if (prompt.length === 0 && files.length === 0) {
            return;
        }

        const chatId = slug ?? "/";
        const currentPrompt = prompt; // Capture current prompt before clearing

        // Clear the prompt immediately for instant feedback
        setPrompt("");

        startTransition(() => {
            // @ts-ignore
            const form = (event.currentTarget?.form);
            // append the chatId to the form data if it exists

            if (form) {
                const formData = new FormData(form);
                formData.set("prompt", currentPrompt); // Use captured prompt since state is cleared
                formData.append("chatId", chatId as string)

                if (includeThinking) {
                    formData.append("includeThinking", "true");
                }

                if (files.length > 0) {
                    for (const file of files) {
                        formData.append("files", file);
                    }
                }


                formAction(formData)
            }
        });
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && event.ctrlKey) {
            event.preventDefault();
            handleSubmit(event);
        }
    }

    return (
        <FileUpload onFilesAdded={handleFilesAdded} multiple accept="image/*,.pdf,.txt,.md,.csv,.json">
            <form action={formAction}>

                <PromptInput
                    className="w-full bg-transparent backdrop-blur-lg dark:backdrop-blur-3xl max-w-4xl mx-auto"
                    value={prompt}
                    onSubmit={undefined}  // Disable built-in Enter submit
                    isLoading={pending}
                    maxHeight={320}
                >
                    {/* File preview area */}
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 border-b border-border/50">
                            {files.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 text-sm"
                                >
                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

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
                                <FileUploadTrigger asChild>
                                    <Button variant={"outline"} type="button" className="rounded-full p-2">
                                        <Paperclip className="text-foreground" />
                                    </Button>
                                </FileUploadTrigger>
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
                                // @ts-ignore
                                isLoading={pending || props.isStreaming}
                                hasContent={prompt.trim().length !== 0 || files.length > 0}
                                onStop={props.onStop}
                            />
                        </PromptInputAction>
                    </PromptInputActions>

                </PromptInput>
            </form>

            {/* Drag and drop overlay */}
            <FileUploadContent className="border-2 border-dashed border-primary/50">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Paperclip className="h-10 w-10 text-primary" />
                    <p className="text-lg font-medium">Drop files here</p>
                    <p className="text-sm text-muted-foreground">
                        Images, PDFs, text files, and more (15 MB max for each file)
                    </p>
                </div>
            </FileUploadContent>
        </FileUpload>
    )
}