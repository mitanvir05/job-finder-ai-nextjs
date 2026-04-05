'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function searchJobsWithAI(query: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { error: "Gemini API key is not configured in .env.local" };
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
      You are an expert tech recruiter and web scraper. 
      The user is looking for a job matching this query: "${query}".
      
      Simulate finding 4-6 highly relevant, recent job postings based on this query. 
      For some of them, try to "find" an HR or recruiter email. For others, leave the email blank to simulate real-world conditions.
      
      You MUST return the data as a raw JSON array of objects. Do not use markdown blocks (\`\`\`json). Just the raw array.
      
      The structure for each object must be EXACTLY:
      {
        "title": "Job Title",
        "company": "Company Name",
        "description": "A 2-3 sentence description of the role.",
        "emailFound": true or false,
        "email": "recruiter@company.com" or null
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up the response in case Gemini adds markdown code blocks anyway
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const jobs = JSON.parse(cleanedText);
        return { success: true, jobs };

    } catch (error) {
        console.error("AI Search Error:", error);
        return { error: "Failed to generate job leads. Please try again." };
    }
}