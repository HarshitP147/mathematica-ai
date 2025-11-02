

'use client'

import { useState, useEffect } from "react"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
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
 * Splits reasoning into logical sections based on double line breaks
 */
function parseResponse(content: string): ParsedResponse {
    const reasoningMatch = content.match(/<reasoning-start>([\s\S]*?)<reasoning-end>/)
    const textMatch = content.match(/<text-start>([\s\S]*?)<text-end>/)

    return {
        reasoning: reasoningMatch ? reasoningMatch[1].trim() : "",
        text: textMatch ? textMatch[1].trim() : ""
    }
}

/**
 * Splits reasoning text into steps based on bold headers (markdown **Title**)
 * Each step contains a title and its associated content
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
    
    // Don't forget the last step
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

    return (
        <Message className={className}>
            <MessageAvatar
                src="/bot-avatar.png"
                alt="AI Assistant"
                fallback="AI"
            />

            <div className="flex flex-col gap-3 w-full">
                {/* Reasoning Dropdown with Chain of Thought Steps Inside */}
                {hasReasoning && reasoningSteps.length > 0 && (
                    <Reasoning isStreaming={isStreaming && !hasText}>
                        <ReasoningTrigger className="text-sm font-medium">
                            💭 View Thinking Process ({reasoningSteps.length} steps)
                        </ReasoningTrigger>
                        <ReasoningContent className="mt-3">
                            <ChainOfThought>
                                {reasoningSteps.map((step, index) => (
                                    <ChainOfThoughtStep
                                        key={index}
                                        defaultOpen={isStreaming && index === reasoningSteps.length - 1}
                                    >
                                        <ChainOfThoughtTrigger
                                            leftIcon={<BrainCircuit className="h-4 w-4" />}
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
                    <>
                        {/* <MessageContent markdown>
                        </MessageContent> */}
                        <Markdown>
                            {parsed.text}
                        </Markdown>
                    </>
                )}

                {/* Streaming indicator when no content yet */}
                {isStreaming && !hasReasoning && !hasText && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <div className="animate-pulse">Thinking...</div>
                    </div>
                )}
            </div>
        </Message>
    )
}