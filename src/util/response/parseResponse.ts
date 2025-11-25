
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
export { parseResponse }