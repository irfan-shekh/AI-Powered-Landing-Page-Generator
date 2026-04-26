import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      data.models.forEach((m: any) => console.log(m.name));
    } else {
      console.log('No models found:', data);
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
