"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"


interface ScrollToBottomProps {
    containerId: string
}

export function ScrollToBottom({ containerId }: ScrollToBottomProps) {
    const [showButton, setShowButton] = useState(false)
    const containerRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const container = document.getElementById(containerId)
        if (!container) return

        containerRef.current = container

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container
            // Show button if user has scrolled up more than 200px from bottom
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 200
            setShowButton(!isNearBottom)
        }

        container.addEventListener("scroll", handleScroll)
        // Initial check
        handleScroll()

        return () => container.removeEventListener("scroll", handleScroll)
    }, [containerId])

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }

    return (
        <AnimatePresence>
            {showButton && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        duration: 0.3
                    }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <Button
                        onClick={scrollToBottom}
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                        aria-label="Scroll to bottom"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
