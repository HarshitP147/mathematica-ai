import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-bl from-secondary to-primary-content flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-4xl  font-bold mb-4">Welcome to Sceal AI</h1>
                <p className="text-lg text-gray-600 mb-6">Your AI-powered assistant for seamless communication.</p>
                <Link href="/chat" className="btn btn-primary btn-lg">Get Started</Link>
            </div>
        </main>
    )
}