import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // 👈 load env manually

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function testModels() {
  const models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
  ];

  console.log("KEY:", process.env.GEMINI_API_KEY); // debug

  for (const name of models) {
    try {
      console.log(`Testing: ${name}`);

      const model = genAI.getGenerativeModel({ model: name });
      const result = await model.generateContent("Say hello");

      console.log(`✅ WORKING: ${name}`);
      console.log(result.response.text());
      console.log("-------------");
    } catch (err: any) {
      console.error(`❌ FAILED: ${name}`);
      console.error(err?.status, err?.message);
      console.log("-------------");
    }
  }
}

testModels();