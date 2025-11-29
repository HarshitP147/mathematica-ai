'use client'

import { useState, useEffect } from "react"
// import { motion } from "motion/react"

import { Message } from "@/components/ui/message"
import {
    ChainOfThought,
    ChainOfThoughtStep,
    ChainOfThoughtTrigger,
    ChainOfThoughtContent,
    ChainOfThoughtItem,
} from "@/components/ui/chain-of-thought"
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ui/reasoning"
import { Markdown } from "../ui/markdown"

import { splitReasoningSteps } from "@/util/response/splitReasoning"
import { parseResponse } from "@/util/response/parseResponse"

type ResponseProps = {
    content: string
    isStreaming?: boolean
    className?: string
}

type ParsedResponse = {
    reasoning: string
    text: string
}

export default function Response({ content, isStreaming = false, className }: ResponseProps) {
    const [parsed, setParsed] = useState<ParsedResponse>({ reasoning: "", text: "" })
    const [reasoningSteps, setReasoningSteps] = useState<Array<{ title: string; content: string }>>([])

    useEffect(() => {
        const result = parseResponse(content)
        setParsed(result)
        setReasoningSteps(splitReasoningSteps(result.reasoning))
    }, [content])

    const hasReasoning = parsed.reasoning.length > 0
    const hasText = parsed.text.length > 0

    if (!hasReasoning && !hasText && !isStreaming) {
        return null
    }

    return (
        <div className="flex w-full justify-start rounded-xl my-4">
            <div className="w-full max-w-full">
                <div className="group relative">
                    <Message
                        role="assistant"
                        className="rounded-2xl px-5 py-4 bg-card/30 backdrop-blur-sm  transition-shadow duration-200"
                    >
                        <div className="flex flex-col gap-4 w-full">
                            {/* Reasoning Section */}
                            {hasReasoning && reasoningSteps.length > 0 && (
                                <Reasoning isStreaming={isStreaming && !hasText}>
                                    <ReasoningTrigger className="text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                        {/* <BrainCircuit className="h-4 w-4" /> */}
                                        <span>View thinking process</span>
                                    </ReasoningTrigger>
                                    <ReasoningContent className="mt-2">
                                        <ChainOfThought>
                                            {reasoningSteps.map((step, index) => (
                                                <ChainOfThoughtStep
                                                    key={index}
                                                    defaultOpen={isStreaming && index === reasoningSteps.length - 1}
                                                >
                                                    <ChainOfThoughtTrigger
                                                        swapIconOnHover
                                                    >
                                                        {step.title}
                                                    </ChainOfThoughtTrigger>
                                                    <ChainOfThoughtContent>
                                                        <ChainOfThoughtItem>
                                                            {step.content}
                                                        </ChainOfThoughtItem>
                                                    </ChainOfThoughtContent>
                                                </ChainOfThoughtStep>
                                            ))}
                                        </ChainOfThought>
                                    </ReasoningContent>
                                </Reasoning>
                            )}

                            {/* Main Text Response */}
                            {hasText && (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <Markdown className="text-">
                                        {parsed.text}
                                    </Markdown>
                                </div>
                            )}

                            {/* Streaming indicator */}
                            {isStreaming && !hasReasoning && !hasText && (
                                <div className="flex items-center gap-3 text-muted-foreground text-sm py-2">
                                    <div className="flex gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary/80 animate-bounce [animation-delay:0ms]" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary/80 animate-bounce [animation-delay:150ms]" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary/80 animate-bounce [animation-delay:300ms]" />
                                    </div>
                                    <span className="text-foreground/70 font-medium">Generating response...</span>
                                </div>
                            )}
                        </div>
                    </Message>
                </div>

            </div>
        </div>
    )
}