import { createGoogleGenerativeAI, google } from "@ai-sdk/google";

const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

const model = googleAI("gemini-2.5-flash");

export { model, googleAI };
