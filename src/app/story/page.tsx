'use client'

import { useState, use, useEffect } from "react"
import Link from "next/link"

import { createClient } from "@/util/supabase/client"


const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/text-to-speech`

export default function Page() {
    const [text, setText] = useState("")
    const [audioUrl, setAudioUrl] = useState("")

    const supabase = createClient()

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
            }
            setAudioUrl("")
            setText("")
        }
    }, [])

    const invokeTextToSpeech = () => {
        if (!text) {
            alert("Please enter some text")
            return
        }


        supabase.functions.invoke(`text-to-speech?text=${encodeURIComponent(text)}`, {
            method: "POST",
            body: JSON.stringify({ text: text, voiceId: "JBFqnCBsd6RMkjVDRZzb" }),
            headers: {
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(2 * 60 * 1000), // 2 minutes timeout
        }).then(async (res) => {

            const { data } = await supabase.storage.from("audio").getPublicUrl('')
            console.log(data)

        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setText("")
        });

    };

    return (
        <main className="min-h-screen flex bg-gradient-to-bl from-secondary to-primary-content flex-col items-center justify-center p-6">
            <div className="text-center">

                <h1 className="text-4xl font-bold mb-4">Story Page</h1>
                <p className="text-lg text-gray-600">This is the story page of Sceal AI.</p>

                <input type="text" placeholder="Enter your story prompt" className="input input-bordered w-full max-w-xs mt-6" value={text} onChange={(e) => setText(e.target.value)} />


                <button className="btn btn-primary btn-lg mt-6" onClick={invokeTextToSpeech}>
                    Invoke Text-to-Speech Function
                </button>

                {audioUrl && (
                    <audio controls src={audioUrl} />
                )}

            </div>
            <Link href="/" className="btn btn-primary btn-lg mt-6">Back to Home</Link>
        </main>
    )
}