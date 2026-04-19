import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Allow more time for generation

export async function POST(req: Request) {
  try {
    const { businessName, industry, targetAudience, goal } = await req.json();

    if (!businessName || !industry || !targetAudience || !goal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { object } = await generateObject({
      model: google('gemini-1.5-pro'),
      schema: z.object({
        hero: z.object({
          headline: z.string(),
          subheadline: z.string(),
          ctaText: z.string(),
        }),
        features: z.array(z.object({
          title: z.string(),
          description: z.string(),
          iconName: z.enum(['Zap', 'Shield', 'Globe', 'Rocket', 'Star', 'CheckCircle', 'TrendingUp', 'Users']),
        })).length(3),
        testimonials: z.array(z.object({
          name: z.string(),
          role: z.string(),
          content: z.string(),
        })),
        pricing: z.array(z.object({
          plan: z.string(),
          price: z.string(),
          features: z.array(z.string()),
          isPopular: z.boolean(),
        })),
        cta: z.object({
          headline: z.string(),
          subheadline: z.string(),
          buttonText: z.string(),
        }),
      }),
      prompt: `Generate a high-converting landing page for:
        * Business Name: ${businessName}
        * Industry: ${industry}
        * Target Audience: ${targetAudience}
        * Goal: ${goal}

        Make the copy persuasive, modern, and startup-style. Use action-oriented language. The output must strictly follow the JSON schema.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate landing page' }, { status: 500 });
  }
}
