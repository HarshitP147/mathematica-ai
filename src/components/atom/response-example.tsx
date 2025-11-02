/**
 * USAGE EXAMPLE for Response Component
 * 
 * This file demonstrates how to use the Response component with streaming data
 * from your /api/chat endpoint that returns the format:
 * <reasoning-start>...<reasoning-end><text-start>...<text-end>
 */

'use client'

import { useState } from "react"
import Response from "./response"

export default function ResponseExample() {
    const [responseContent, setResponseContent] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)

    const handleStreamingResponse = async () => {
        setIsStreaming(true)
        setResponseContent("")

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt: "How do I get smooth skin and look youthful?" }),
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.body) return

            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                
                if (value) {
                    const chunk = decoder.decode(value, { stream: true })
                    setResponseContent(prev => prev + chunk)
                }
            }
        } finally {
            setIsStreaming(false)
        }
    }

    return (
        <div className="space-y-4 p-4">
            <button 
                onClick={handleStreamingResponse}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
                Test Streaming Response
            </button>

            {/* The Response component handles parsing and rendering */}
            <Response 
                content={responseContent}
                isStreaming={isStreaming}
            />
        </div>
    )
}

/**
 * INTEGRATION with your chat-prompt.tsx:
 * 
 * 1. Store responses in an array:
 *    const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
 * 
 * 2. As you stream, accumulate the full response:
 *    setResponseText(prev => prev + chunk)
 * 
 * 3. Render each assistant message with Response component:
 *    {messages.map((msg, idx) => (
 *        msg.role === 'assistant' ? (
 *            <Response key={idx} content={msg.content} />
 *        ) : (
 *            <UserMessage key={idx} content={msg.content} />
 *        )
 *    ))}
 * 
 * 4. For the currently streaming message:
 *    <Response content={currentStreamingText} isStreaming={true} />
 */
