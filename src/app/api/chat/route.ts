import { streamText } from "ai";
import { google, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

export const maxDuration = 300; // 5 minutes

export async function GET() {
    return new Response("Chat endpoint is live");
}

export async function POST(req: Request) {
    const { prompt } = await req.json();
    console.clear();

    console.log("Received prompt:", prompt);

    const result = streamText({ // model: google("gemini-2.5-pro"),
        model: google("gemini-2.5-pro"),
        prompt: prompt,
        providerOptions: {
            google: {
                thinkingConfig: {
                    includeThoughts: true,
                    thinkingBudget: 8192,
                },
            } satisfies GoogleGenerativeAIProviderOptions,
        },
    });

    const responseStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of result.fullStream) {
                switch (chunk.type) {
                    case "text-start":
                        controller.enqueue(
                            new TextEncoder().encode("<text-start>"),
                        );
                        break;
                    case "text-end":
                        controller.enqueue(
                            new TextEncoder().encode("<text-end>"),
                        );
                        controller.close();
                        break;
                    case "reasoning-start":
                        controller.enqueue(
                            new TextEncoder().encode("<reasoning-start>"),
                        );
                        break;
                    case "reasoning-end":
                        controller.enqueue(
                            new TextEncoder().encode("<reasoning-end>"),
                        );
                        break;
                    case "text-delta":
                    case "reasoning-delta":
                        controller.enqueue(
                            new TextEncoder().encode(chunk.text),
                        );
                        break;
                }


            }
        },
    });

    return new Response(responseStream, {
        headers: {
            "Content-Type": "text/event-stream",
        },
    });
}
