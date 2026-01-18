'use server';

import mammoth from 'mammoth';
import pdf from 'pdf-parse-new';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

function safeJSONParse(raw: string) {
    const cleaned = raw.replace(/```json|```/gi, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Response did not contain valid JSON');
    return JSON.parse(cleaned.slice(start, end + 1));
}

async function callGroq(messages: any[], temperature = 0.3) {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY missing");

    const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: MODEL,
            messages,
            temperature,
            response_format: { type: "json_object" }
        })
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Groq API Error: ${text}`);

    const json = JSON.parse(text);
    const content = json?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from AI');

    return safeJSONParse(content);
}

async function extractResumeText(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = file.type === 'application/pdf'
        ? (await pdf(buffer)).text
        : (await mammoth.extractRawText({ buffer })).value;
    return text.replace(/\s+/g, ' ').slice(0, 15000);
}

export async function analyzeResume(formData: FormData, targetRole: string) {
    const file = formData.get('resume') as File;
    if (!file) return { error: 'No file uploaded' };

    try {
        const resumeText = await extractResumeText(file);

        const data = await callGroq([
            {
                role: 'system',
                content: `You are a Senior Career Architect for Tech. 
                Analyze the resume for the role: "${targetRole}".
                
                Return STRICT JSON with this schema:
                {
                    "resumeScore": number,
                    "atsScore": number,
                    "executiveSummary": "string",
                    "fitAnalysis": { "seniorityLevel": "string", "verdict": "string" },
                    "skillGraph": [{ "skill": "string", "score": number }],
                    "techStack": [{ "technology": "string", "proficiency": number }],
                    "skillGaps": [{ "skill": "string", "severity": "High/Medium/Low", "impact": "string", "fix": "string" }],
                    "roadmap": [
                        { 
                            "phase": "string (e.g. Phase 1: Foundation)", 
                            "week": "string (e.g. Week 1-2)", 
                            "goals": ["string", "string"],
                            "resources": ["string"]
                        }
                    ],
                    "courseRecommendations": [
                        {
                            "title": "string",
                            "platform": "string",
                            "link": "string (optional/placeholder)",
                            "reason": "string",
                            "difficulty": "Beginner/Intermediate/Advanced"
                        }
                    ]
                }`
            },
            { role: 'user', content: resumeText }
        ]);

        return { success: true, data, resumeText };
    } catch (err: any) {
        console.error("Analysis Error:", err);
        return { error: err.message };
    }
}

export async function analyzeDeepResume(baseData: any, location: string) {
    try {
        const data = await callGroq([
            {
                role: 'system',
                content: `Market Analyst. Location: "${location}".
                Return STRICT JSON:
                {
                    "marketStanding": "string",
                    "demandLevel": "Very High/High/Medium/Low",
                    "hireabilityVerdict": "string",
                    "salaryEstimate": { "junior": "string", "mid": "string", "senior": "string" }
                }`
            },
            { role: 'user', content: JSON.stringify(baseData) }
        ], 0.4);

        return { success: true, data };
    } catch (err: any) {
        return { error: err.message };
    }
}