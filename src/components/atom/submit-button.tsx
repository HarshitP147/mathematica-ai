'use client'

import { AnimatePresence, motion } from "motion/react"
import { SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


type SubmitButtonProps = {
    hasContent: boolean;
    onClick?: () => void;
    isSubmitting: boolean;  // Form is being submitted to server
    isGenerating: boolean;  // AI is generating response
    onStop?: () => void;
}


export default function SubmitButton({ hasContent, onClick, isSubmitting, isGenerating, onStop }: SubmitButtonProps) {
    const showButton = hasContent || isSubmitting || isGenerating;

    return (
        <AnimatePresence mode="wait">
            {showButton && (
                <motion.div
                    key={isGenerating ? "stop" : "send"}
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
                                {isSubmitting ? (
                                    <Button
                                        type="button"
                                        size="icon"
                                        className=" rounded-full"
                                        disabled
                                    >
                                        <Spinner className="w-4 h-4" />
                                        <span className="sr-only">Submitting...</span>
                                    </Button>
                                ) :
                                    isGenerating ? (
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="shrink-0 rounded-full"
                                            onClick={onStop}
                                        >
                                            <Spinner className="w-4 h-4" />
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
                                    {isSubmitting ? "Sending..." : isGenerating ? "Stop generating" : "Send • Ctrl+Enter"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </motion.div>
            )}
        </AnimatePresence>
    )
}