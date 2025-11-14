'use client'

import { motion } from "motion/react"
import { useParams } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
    const params = useParams()
    const chatId = params?.slug as string | undefined

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="flex flex-col items-center gap-6">
                <Spinner className="h-12 w-12 text-primary" />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-2xl font-semibold text-foreground">
                        Loading chat {chatId && `- ${chatId}`}
                    </h2>
                </motion.div>
            </div>
        </div>
    )
}