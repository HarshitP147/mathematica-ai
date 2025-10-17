'use client'

// import { useState, useEffect } from "react"
import Link from "next/link"

import generateAudio from "./actions"
import { use } from "react"


export default function Page() {
    // const [text, setText] = useState("")
    // const [audioUrl, setAudioUrl] = useState("")


    // useEffect(() => {
    // return () => {
    //     if (audioUrl) {
    //         URL.revokeObjectURL(audioUrl)
    //     }
    //     setAudioUrl("")
    //     setText("")
    // }
    // }, [])

    // const invokeTextToSpeech = () => {
    //     if (!text) {
    //         alert("Please enter some text")
    //         return
    //     }


    // supabase.functions.invoke(`text-to-speech?text=${encodeURIComponent(text)}`, {
    //     method: "POST",
    //     body: JSON.stringify({ text: text, voiceId: "JBFqnCBsd6RMkjVDRZzb" }),
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     signal: AbortSignal.timeout(2 * 60 * 1000), // 2 minutes timeout
    // }).then(async (res) => {

    //     const { data } = await supabase.storage.from("audio").getPublicUrl('')
    //     console.log(data)

    // }).catch((err) => {
    //     console.error(err)
    // }).finally(() => {
    //     setText("")
    // });
    // };




    return (
        <form action={generateAudio} className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold my-4">Story Page</h1>

            <div className="flex flex-col gap-4">
                <textarea className="textarea rounded-md" name="textarea"></textarea>

                <button type="submit" className="btn btn-primary rounded-md ">Generate Audio</button>
            </div>


            <Link href="/">
                <button className="btn btn-primary rounded-md mx-auto">
                    Go back to Home
                </button>
            </Link>
        </form>
    )
}