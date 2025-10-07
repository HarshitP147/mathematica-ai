import "supabase";
import { createClient } from "supabase-js";
import { ElevenLabsClient } from "elevenlabs";
import * as hash from "object-hash";

import { corsHeaders } from "../_shared/cors.ts";

// Initialize Supabase client

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

const elevenlabs = new ElevenLabsClient({
  apiKey: Deno.env.get("ELEVENLABS_API_KEY") ?? "",
});

async function uploadAudioToStorage(
  stream: ReadableStream,
  requestHash: string,
) {
  const { data, error } = await supabase.storage
    .from("audio")
    .upload(`audio-${requestHash}.mp3`, stream, {
      contentType: "audio/mp3",
    });

  console.log("Storage upload result:", { data, error });
}

Deno.serve(async (req) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const params = new URL(req.url).searchParams;

  const text = params.get("text") ?? "";
  const voiceId = params.get("voiceId") ?? "JBFqnCBsd6RMkjVDRZzb";

  if (!text) {
    return new Response("Bad Request: 'text' parameter is required", {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log(`Received text: ${text}`);
  console.log(`Using voice ID: ${voiceId}`);

  // generate a hash of the content
  const requestHash = hash.MD5({ text, voice: voiceId });
  console.log(`Request hash: ${requestHash}`);

  // check for existing audio file
  const { data } = await supabase.storage.from("audio").createSignedUrl(
    `audio-${requestHash}.mp3`,
    60,
  );

  // if exists return the signed URL

  if (data) {
    console.log("Existing audio found, returning signed URL.");
    const storageRes = await fetch(data.signedUrl);
    if (storageRes.ok) {
      return new Response(storageRes.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/mp3",
        },
      });
    } else {
      console.log("No existing audio found, generating new audio.");
    }
  }

  try {
    console.log("Generating new audio with ElevenLabs...");
    const response = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128", // high quality mp3
    });

    const stream = new ReadableStream({
      start: async (controller) => {
        for await (const chunk of response) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    console.log("Audio generation complete.");

    // Branch stream to supabase storage
    const [browserStream, storageStream] = stream.tee();

    // upload to supabase storage in the background
    EdgeRuntime.waitUntil(uploadAudioToStorage(storageStream, requestHash));

    return new Response(browserStream, {
      headers: {
        "Content-Type": "audio/mp3",
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error("Error generating audio:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/text-to-speech' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
