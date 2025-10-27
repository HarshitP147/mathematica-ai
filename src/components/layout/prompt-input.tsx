"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent } from "react"
import {  usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"
import { ImageIcon, SendIcon, XIcon, FileIcon } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { someAction } from "@/app/chat/actions";
import { ScrollToBottom } from "../atom/scroll-to-bottom"

interface FilePreview {
    id: string
    file: File
    preview?: string
    type: "image" | "pdf"
}

export function PromptInput() {
    const pathname = usePathname();

    const [input, setInput] = useState("")
    const [files, setFiles] = useState<FilePreview[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const hasContent = input.trim().length > 0 || files.length > 0

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])

        const newFiles: FilePreview[] = selectedFiles.map((file) => {
            const id = Math.random().toString(36).substring(7)
            const type = file.type.startsWith("image/") ? "image" : "pdf"

            if (type === "image") {
                const preview = URL.createObjectURL(file)
                return { id, file, preview, type }
            }

            return { id, file, type }
        })

        setFiles((prev) => [...prev, ...newFiles])

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const fileToRemove = prev.find((f) => f.id === id)
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview)
            }
            return prev.filter((f) => f.id !== id)
        })
    }

    const handleSubmit = () => {
        if (!hasContent) return

        someAction(input, files, pathname)

        // Clean up previews
        files.forEach((file) => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview)
            }
        })

        // Reset
        setInput("")
        setFiles([])
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.ctrlKey) {

            handleSubmit()
        }
    }

    return (
        <>
            <ScrollToBottom containerId="chat-messages-container" />
            <form className="relative rounded-2xl border border-border w-full dark:bg-white/5 backdrop-blur-md dark:backdrop-blur-[2px] shadow-lg">
                {/* File Previews */}
                {files.length > 0 && (
                    <div className="p-3 border-b border-border">
                        <div className="flex flex-wrap gap-2">
                            {files.map((file) => (
                                <TooltipProvider key={file.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="relative group">
                                                {file.type === "image" && file.preview ? (
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
                                                        <img
                                                            src={file.preview || "/placeholder.svg"}
                                                            alt={file.file.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            onClick={() => removeFile(file.id)}
                                                            className="absolute top-1 right-1 bg-background/90 hover:bg-background rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <XIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center">
                                                        <FileIcon className="w-6 h-6 text-muted-foreground" />
                                                        <button
                                                            onClick={() => removeFile(file.id)}
                                                            className="absolute top-1 right-1 bg-background/90 hover:bg-background rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <XIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-sm">{file.file.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Bar */}
                <div className="flex items-end gap-2 p-3">
                    {/* Upload Button */}
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="w-5 h-5" />
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask something here..."
                        className={"flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[40px] max-h-[200px] px-2 py-2.5"}
                        rows={1}
                        style={{
                            height: "auto",
                            minHeight: "40px",
                        }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement
                            target.style.height = "auto"
                            target.style.height = `${Math.min(target.scrollHeight, 200)}px`
                        }}
                    />

                    {/* Send Button with Animation */}
                    <AnimatePresence mode="wait">
                        {hasContent && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            >
                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" className="shrink-0 rounded-full" onClick={handleSubmit}>
                                                <SendIcon className="w-5 h-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p className="text-xs">Send • Ctrl+Enter</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </>

    )
}
