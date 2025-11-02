'use client'

import { AnimatePresence, motion } from "motion/react"
import { SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


type SubmitButtonProps = {
    hasContent: boolean;
    onClick?: () => void;
    isLoading: boolean;
}


export default function SubmitButton({ hasContent, onClick, isLoading }: SubmitButtonProps) {
    return (
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
                    onClick={onClick}
                >
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button disabled={isLoading} size="icon" className="shrink-0 rounded-full">
                                    {isLoading ? (
                                        <Spinner className="w-5 h-5" />
                                    ) : (
                                        <SendIcon className="w-5 h-5" />
                                    )}
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
    )
}