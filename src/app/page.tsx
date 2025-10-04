import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <p className="mt-3 text-lg">
                This is a sample Next.js application with Tailwind CSS.
            </p>
            <Button>Click me</Button>
        </div>
    )
}