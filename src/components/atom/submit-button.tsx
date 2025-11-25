'use client'

import { AnimatePresence, motion } from "motion/react"
import { SendIcon, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


type SubmitButtonProps = {
    hasContent: boolean;
    onClick?: () => void;
    isLoading: boolean;
    onStop?: () => void;
}


export default function SubmitButton({ hasContent, onClick, isLoading, onStop }: SubmitButtonProps) {
    const showButton = hasContent || isLoading;

    return (
        <AnimatePresence mode="wait">
            {showButton && (
                <motion.div
                    key={isLoading ? "stop" : "send"}
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
                                {isLoading ? (
                                    <Button
                                        type="button"
                                        size="icon"
                                        className="shrink-0 rounded-full"
                                        onClick={onStop}
                                    >
                                        <Square className="w-3 h-3 fill-current" />
                                        <span className="sr-only">Stop generating</span>
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="shrink-0 rounded-full"
                                        onClick={onClick}
                                    >
                                        <SendIcon className="w-5 h-5" />
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                )}
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p className="text-xs">
                                    {isLoading ? "Stop generating" : "Send • Ctrl+Enter"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </motion.div>
            )}
        </AnimatePresence>
    )
}