'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 🔥 Model priority (best → fallback)
const MODEL_FALLBACKS = [
  "gemini-3-pro-preview",
  "gemini-3-flash-preview",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

// ⏱ Timeout wrapper
async function withTimeout<T>(promise: Promise<T>, ms = 30000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), ms)
  );

  return Promise.race([promise, timeout]);
}

// 🔁 Retry logic (per model)
async function generateWithRetry(
  model: any,
  prompt: string,
  retries = 2
): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      const result: any = await withTimeout(
        model.generateContent(prompt),
        30000
      );

      return result.response.text();
    } catch (error: any) {
      const isLast = i === retries - 1;

      console.error(`Retry ${i + 1} failed:`, error.message);

      if (
        (error?.status === 503 || error.message === 'Request timeout') &&
        !isLast
      ) {
        const delay = (i + 1) * 2000;
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Retry failed');
}

// 🧠 Multi-model fallback
async function generateWithFallback(prompt: string): Promise<string> {
  let lastError: any = null;

  for (const modelName of MODEL_FALLBACKS) {
    try {
      console.log(`⚡ Trying model: ${modelName}`);

      const model = genAI.getGenerativeModel({ model: modelName });

      const text = await generateWithRetry(model, prompt);

      console.log(`✅ Success with: ${modelName}`);

      return text;
    } catch (error: any) {
      console.error(`❌ Model failed: ${modelName}`, error.message);
      lastError = error;
    }
  }

  throw lastError || new Error('All models failed');
}

// 🧹 Extract JSON safely
function extractJSON(text: string) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Invalid JSON');
  return JSON.parse(match[0]);
}

// 🚀 Main function
export async function searchJobsWithAI(query: string) {
  try {
    const prompt = `
You are an expert tech recruiter.

The user is searching for: "${query}"

Simulate 4-6 realistic job postings.
The structure for each object must be EXACTLY:
{
  "title": "Job Title",
  "company": "Company Name",
  "description": "A 2-3 sentence description.",
  "emailFound": true or false,
  "email": "recruiter@company.com" or null
}

Return ONLY JSON array.
`;

    // 🔥 Uses fallback instead of single model
    const responseText = await generateWithFallback(prompt);

    const jobs = extractJSON(responseText);

    return { success: true, jobs };
  } catch (error) {
    console.error('AI Error:', error);
    return { error: 'Failed to generate jobs' };
  }
}