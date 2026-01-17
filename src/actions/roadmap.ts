'use server';

import { model } from '@/lib/gemini';

export async function generateRoadmap(skillGaps: string[], targetRole: string) {
    const prompt = `
        Act as a Senior Mentor. Create a 5-step roadmap to become a ${targetRole}.
        Focus on these gaps: ${skillGaps.join(', ')}.
        Return a JSON array of objects with keys: id, title, description, proofOfWork, duration.
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        return JSON.parse(result.response.text());
    } catch (error) {
        // Fallback steps if AI fails
        return [
            { id: 1, title: "Deepen Fundamentals", description: "Master core concepts", proofOfWork: "Build a project", duration: "2 weeks" }
        ];
    }
}