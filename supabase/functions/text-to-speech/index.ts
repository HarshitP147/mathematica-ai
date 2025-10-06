// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { ElevenLabsClient } from 'npm:elevenlabs';
import * as hash from 'npm:object-hash';

// Supabase client with service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

const elevenlabs = new ElevenLabsClient({
  apiKey: Deno.env.get('ELEVENLABS_API_KEY')
});



Deno.serve(async (req) => {
  // To secure your function for production, you can for example validate the request origin,
  // or append a user access token and validate it with Supabase Auth.
  console.log('Request origin', req.headers.get('host'));
  
  // Parse request body
  let text = '';
  let voiceId = 'JBFqnCBsd6RMkjVDRZzb';
  
  try {
    const body = await req.json();
    text = body.text || '';
    voiceId = body.voiceId || voiceId;
    console.log('Request body:', { text, voiceId });
  } catch (error) {
    console.error('Failed to parse request body:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const requestHash = hash.MD5({ text, voiceId });
  console.log('Request hash', requestHash);

  // Check storage for existing audio file
  const { data: fileData, error: fileError } = await supabase.storage.from('audio').list('', {
    search: `${requestHash}.mp3`
  });

  if (fileData && fileData.length > 0) {
    console.log('Audio file found in storage, downloading...');
    const { data: audioData, error: downloadError } = await supabase.storage
      .from('audio')
      .download(`${requestHash}.mp3`);
    
    if (audioData && !downloadError) {
      console.log('Returning cached audio');
      return new Response(audioData.stream(), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'X-Cache-Status': 'HIT',
        },
      });
    }
  }

  if (!text) {
    return new Response(JSON.stringify({ error: 'Text parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('ElevenLabs API call');
    // Use convert method which returns a ReadableStream directly
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      output_format: 'mp3_44100_128',
      model_id: 'eleven_multilingual_v2',
      text,
    });

    // audioStream is already a ReadableStream<Uint8Array>
    // Branch stream to Supabase Storage
    const [browserStream, storageStream] = audioStream.tee();

    // store the audio in Supabase Storage
    const { error: uploadError } = await supabase.storage.from('audio').upload(`${requestHash}.mp3`, storageStream, {
      contentType: 'audio/mp3',
      upsert: true,
    });

    if (uploadError) {
      console.error('Failed to upload audio to storage:', uploadError);
    } else {
      console.log('Audio uploaded to storage successfully');
    }

    console.log('Returning audio stream to client');


    // Return the streaming response immediately
    return new Response(browserStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.log('error', { error });
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
