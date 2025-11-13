
import { Lightbulb, LightbulbOff } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export default function IncludeThinking({ includeThinking }: { includeThinking: boolean }) {

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={includeThinking ? "included" : "not-included"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                color="inherit"
                transition={{
                    duration: 0.2,
                    ease: "easeInOut"
                }}
            >


                {includeThinking ? (
                    <Lightbulb className="" />
                ) : (
                    <LightbulbOff className="" />
                )}
            </motion.div>
        </AnimatePresence>
    )
}