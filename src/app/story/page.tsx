'use client'
import { useRef, useState } from "react"
import { createClient } from "@/util/supabase/client"

export default function Page() {
    const [storyPrompt, setStoryPrompt] = useState("")
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize Supabase client

    const supabase = createClient()

    const handleGenerateStory = async () => {
        if (!storyPrompt.trim()) {
            setError("Please enter some text to generate audio")
            return
        }

        setIsLoading(true)
        setError(null)
        setAudioUrl(null)

        try {
            // Get Supabase config
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

            // Invoke the text-to-speech function with fetch for binary response
            const response = await fetch(
                `${supabaseUrl}/functions/v1/text-to-speech`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                    },
                    body: JSON.stringify({ text: storyPrompt }),
                }
            )

            if (!response.ok) {
                const contentType = response.headers.get('content-type')
                if (contentType?.includes('application/json')) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Failed to generate audio')
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }
            }

            // Get the audio as a Blob
            const audioBlob = await response.blob()
            
            // Create object URL from the Blob
            const url = URL.createObjectURL(audioBlob)
            
            setAudioUrl(url)
            console.log("Audio generated successfully", { size: audioBlob.size, type: audioBlob.type })

        } catch (err) {
            console.error("Error invoking function", err)
            setError(err instanceof Error ? err.message : "Failed to generate audio")
        } finally {
            setIsLoading(false)
        }
    }

    // Cleanup object URL when component unmounts or audioUrl changes
    const handleClearAudio = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl)
            setAudioUrl(null)
        }
    }

    return (
        <main className="min-h-screen bg-base-200 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h1 className="card-title text-3xl mb-4">Text to Speech Generator</h1>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Enter your text</span>
                                <span className="label-text-alt">{storyPrompt.length} characters</span>
                            </label>
                            <textarea 
                                className="textarea textarea-bordered w-full h-48" 
                                placeholder="Enter your story prompt or text here..." 
                                value={storyPrompt} 
                                onChange={(e) => setStoryPrompt(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="card-actions justify-end mt-4">
                            <button 
                                className="btn btn-primary"
                                onClick={handleGenerateStory}
                                disabled={isLoading || !storyPrompt.trim()}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Speech'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Audio Player Section */}
                {audioUrl && (
                    <div className="card bg-base-100 shadow-xl mt-6">
                        <div className="card-body">
                            <h2 className="card-title">Generated Audio</h2>
                            
                            <div className="flex flex-col gap-4">
                                <audio 
                                    controls 
                                    ref={audioRef}
                                    className="w-full"
                                    src={audioUrl}
                                    autoPlay
                                >
                                    Your browser does not support the audio element.
                                </audio>

                                <div className="flex gap-2">
                                    <a 
                                        href={audioUrl} 
                                        download="generated-speech.mp3"
                                        className="btn btn-sm btn-outline"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download
                                    </a>
                                    <button 
                                        onClick={handleClearAudio}
                                        className="btn btn-sm btn-ghost"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}