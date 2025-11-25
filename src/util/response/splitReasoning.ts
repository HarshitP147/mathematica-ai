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

export { splitReasoningSteps }