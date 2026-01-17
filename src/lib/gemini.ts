import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Create a safe initialization wrapper
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Gemini 3 Flash: The 2026 standard for speed and intelligence.
 * Optimized for structured data extraction and rapid document analysis.
 */
export const model = genAI ? genAI.getGenerativeModel({
    model: "gemini-3-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1, // Lowered for more consistent JSON structure
    }
}) : {
    generateContent: async () => {
        throw new Error("GEMINI_API_KEY is missing in .env.local");
    }
};

/**
 * Gemini Embedding 001: The unified stable model for 2026.
 * Replaces text-embedding-004 with better multilingual performance.
 */
export const embeddingModel = genAI ? genAI.getGenerativeModel({
    model: "gemini-embedding-001"
}) : {
    embedContent: async () => {
        throw new Error("GEMINI_API_KEY is missing in .env.local");
    }
};