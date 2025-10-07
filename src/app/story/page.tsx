import Link from "next/link"

export default function Page() {
    return (
        <main className="min-h-screen bg-gradient-to-bl from-secondary to-primary-content flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Story Page</h1>
                <p className="text-lg text-gray-600">This is the story page of Sceal AI.</p>
                <Link href="/" className="btn btn-primary btn-lg mt-6">Back to Home</Link>
            </div>
        </main>
    )
}