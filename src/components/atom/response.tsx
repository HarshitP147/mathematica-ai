

'use client'

import { useState, useEffect } from "react"
import { Message } from "@/components/ui/message"
import {
    ChainOfThought,
    ChainOfThoughtStep,
    ChainOfThoughtTrigger,
    ChainOfThoughtContent,
    ChainOfThoughtItem,
} from "@/components/ui/chain-of-thought"
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ui/reasoning"
import { BrainCircuit } from "lucide-react"
import { Markdown } from "../ui/markdown"

type ResponseProps = {
    content: string
    isStreaming?: boolean
    className?: string
}

type ParsedResponse = {
    reasoning: string
    text: string
}

/**
 * Parses the response format from test.txt:
 * <reasoning-start>...<reasoning-end><text-start>...<text-end>
 * 
 * Handles both complete and streaming (partial) content
 */
function parseResponse(content: string): ParsedResponse {
    // Check for reasoning section - handle both complete and streaming
    let reasoning = ""
    const reasoningStartIndex = content.indexOf("<reasoning-start>")
    const reasoningEndIndex = content.indexOf("<reasoning-end>")
    
    if (reasoningStartIndex !== -1) {
        const reasoningContent = reasoningEndIndex !== -1
            ? content.substring(reasoningStartIndex + 17, reasoningEndIndex) // Complete reasoning
            : content.substring(reasoningStartIndex + 17) // Streaming reasoning (no end tag yet)
        reasoning = reasoningContent.trim()
    }
    
    // Check for text section - handle both complete and streaming
    let text = ""
    const textStartIndex = content.indexOf("<text-start>")
    const textEndIndex = content.indexOf("<text-end>")
    
    if (textStartIndex !== -1) {
        const textContent = textEndIndex !== -1
            ? content.substring(textStartIndex + 12, textEndIndex) // Complete text
            : content.substring(textStartIndex + 12) // Streaming text (no end tag yet)
        text = textContent.trim()
    }

    return {
        reasoning,
        text
    }
}

/**
 * Splits reasoning text into steps based on bold headers (markdown **Title**)
 * Each step contains a title and its associated content
 * Handles streaming content - can process incomplete steps
 */
function splitReasoningSteps(reasoning: string): Array<{ title: string; content: string }> {
    if (!reasoning) return []
    
    // Split by lines that start with ** (bold markdown headers)
    const lines = reasoning.split('\n')
    const steps: Array<{ title: string; content: string }> = []
    let currentTitle = ''
    let currentContent: string[] = []
    
    for (const line of lines) {
        // Check if line is a bold header (starts and ends with **)
        const titleMatch = line.match(/^\*\*(.*?)\*\*$/)
        
        if (titleMatch) {
            // Save previous step if exists
            if (currentTitle) {
                steps.push({
                    title: currentTitle,
                    content: currentContent.join('\n').trim()
                })
            }
            // Start new step
            currentTitle = titleMatch[1].trim()
            currentContent = []
        } else if (line.trim()) {
            // Add content to current step
            currentContent.push(line)
        }
    }
    
    // Don't forget the last step (even if incomplete during streaming)
    if (currentTitle) {
        steps.push({
            title: currentTitle,
            content: currentContent.join('\n').trim()
        })
    }
    
    return steps
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
        <div className="flex w-full justify-start">
            <div className="w-full max-w-full">
                <div className="group relative">
                    <Message 
                        role="assistant" 
                        className="rounded-xl px-4 py-3"
                    >
                        <div className="flex flex-col gap-3 w-full">
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
                                    <Markdown>
                                        {parsed.text}
                                    </Markdown>
                                </div>
                            )}

                            {/* Streaming indicator */}
                            {isStreaming && !hasReasoning && !hasText && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
                                    <span className="ml-2">Thinking...</span>
                                </div>
                            )}
                        </div>
                    </Message>
                </div>
            </div>
        </div>
    )
}