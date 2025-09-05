import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

async function handleRequest(message) {
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

async function validateEnvAndMessage(message) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return new Response(JSON.stringify({ error: 'Invalid message' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return null;
}

export async function POST(req) {
  let message;
  try {
    ({ message } = await req.json());
  } catch {}

  const errorResponse = await validateEnvAndMessage(message);
  if (errorResponse) return errorResponse;

  return handleRequest(message);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const message = searchParams.get('message');

  const errorResponse = await validateEnvAndMessage(message);
  if (errorResponse) return errorResponse;

  return handleRequest(message);
}
