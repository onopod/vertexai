import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let message;
  try {
    ({ message } = await req.json());
  } catch {}

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return new Response(JSON.stringify({ error: 'Invalid message' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    prompt: message,
  });
  const response = result.toAIStreamResponse();
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}
