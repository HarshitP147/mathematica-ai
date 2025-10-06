import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-bl from-secondary from-5% via-neutral to-primary-content flex items-center justify-center p-6">
            <div className="text-center  px-8 rounded-box py-4 ">
                <h1 className="text-4xl  font-bold mb-4">Welcome to Sceal AI</h1>
                <p className="text-lg text-base-content mb-6">An AI powered platform for story generation and narration.</p>
                <Link href="/story" className="btn btn-primary btn-lg rounded-box">Get Started</Link>
            </div>
        </main>
    )
}