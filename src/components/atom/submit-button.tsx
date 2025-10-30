'use client'

import { AnimatePresence, motion } from "motion/react"
import { SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


export default function SubmitButton({ hasContent }: { hasContent: boolean }) {
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
                >
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" className="shrink-0 rounded-full">
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
    )
}