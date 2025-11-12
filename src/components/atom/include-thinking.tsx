
import { Lightbulb, LightbulbOff } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export default function IncludeThinking({ includeThinking }: { includeThinking: boolean }) {

    return (
        <AnimatePresence mode="wait" initial={false}>
            {includeThinking ? (
                <motion.div
                    key="lightbulb-on"
                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                        duration: 0.3
                    }}
                >
                    <Lightbulb className="h-4 w-4" />
                </motion.div>
            ) : (
                <motion.div
                    key="lightbulb-off"
                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                        duration: 0.3
                    }}
                >
                    <LightbulbOff className="h-4 w-4" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}