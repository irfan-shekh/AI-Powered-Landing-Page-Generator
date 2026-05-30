import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

export const maxDuration = 120;

const SYSTEM_PROMPT = `You are a world-class Frontend Engineer and UI/UX Designer.
Your task is to generate a single, complete, production-ready HTML file for a landing page based on the user's request.

Rules:
1. Return ONLY raw HTML code. Do not use markdown code blocks (e.g., \`\`\`html). Do not add explanations.
2. The HTML must be a single file containing:
   - All necessary CSS styles (use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>).
   - All necessary JavaScript (embedded in <script> tags at the end of the body).
   - Meaningful, marketing-oriented content.
3. Design requirements:
   - Modern, clean, and responsive layout.
   - Use 'Inter' font from Google Fonts.
   - Use https://picsum.photos/ for placeholder images.
   - Use FontAwesome (via CDN) or SVG icons for icons.
   - Dark mode or Light mode should be based on the user's request (default to dark mode if unspecified).
4. If 'Current HTML' is provided, modify it according to the 'User Request'.`;

export async function POST(req: Request) {
  try {
    const { prompt, currentHtml } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const userContent = currentHtml
      ? `User Request: "${prompt}"\n\nCurrent HTML Code:\n${currentHtml}`
      : `Create a complete, single-file HTML landing page based on: "${prompt}". Make it look amazing.`;

    const result = streamText({
      model: google('gemini-3-flash-preview'),
      system: SYSTEM_PROMPT,
      prompt: userContent,
    });

    return result.toTextStreamResponse();

  } catch (error: unknown) {
    console.error('Generation Error Detail:', error);

    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : 'Failed to generate landing page';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}