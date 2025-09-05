import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = 'edge';

export async function POST(req) {
  const { message } = await req.json();
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    prompt: message,
  });
  return result.toAIStreamResponse();
}
