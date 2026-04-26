import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function test() {
  try {
    console.log('Testing Gemini 3 Flash Preview...');
    const { text } = await generateText({
      model: google('gemini-3-flash-preview'),
      prompt: 'Say hello',
    });
    console.log('Success:', text);
  } catch (error) {
    console.error('Failure:', error);
  }
}

test();
