'use server';

import mammoth from 'mammoth';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

// Groq Config
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

// --- PDF EXTRACTION LOGIC (Turbopack Compatible) ---
async function extractPdfText(buffer: Buffer): Promise<string> {
    // Convert Buffer to Uint8Array for pdfjs
    const data = new Uint8Array(buffer);

    // Load document using the legacy build (no worker required in Node context usually, 
    // or it handles it internally better than the standard build for Vercel)
    const loadingTask = getDocument({
        data,
        useSystemFonts: true, // Helps with font rendering in Node
        disableFontFace: true // Disables font face loading to avoid DOM errors
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    // Iterate through pages
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Extract string items and join them
        const pageText = textContent.items
            .filter((item: any) => item.str)
            .map((item: any) => item.str)
            .join(" ");
        fullText += pageText + "\n";
    }

    return fullText;
}

// --- HELPER: JSON PARSING ---
function safeJSONParse(raw: string) {
    const cleaned = raw.replace(/```json|```/gi, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Response did not contain valid JSON');
    return JSON.parse(cleaned.slice(start, end + 1));
}

// --- HELPER: GROQ API CALLER ---
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

// --- MAIN ACTION: ANALYZE RESUME ---
export async function analyzeResume(formData: FormData, targetRole: string) {
    const file = formData.get('resume') as File;
    if (!file) return { error: 'No file uploaded' };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        let resumeText = "";

        // Extraction Strategy
        if (file.type === 'application/pdf') {
            resumeText = await extractPdfText(buffer);
        } else {
            const data = await mammoth.extractRawText({ buffer });
            resumeText = data.value;
        }

        // Truncate to avoid token limits (approx 15k chars is safe for 8b model input)
        const truncatedText = resumeText.replace(/\s+/g, ' ').slice(0, 15000);

        // AI Analysis
        const data = await callGroq([
            {
                role: 'system',
                content: `You are a Senior Career Architect for Tech. 
                Analyze the resume for the role: "${targetRole}".
                
                CRITICAL: All numerical scores (resumeScore, atsScore, skill scores) MUST be integers between 0 and 100.
                
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
            { role: 'user', content: truncatedText }
        ]);

        return { success: true, data, resumeText: truncatedText };

    } catch (err: any) {
        console.error("Analysis Error:", err);
        return { error: err.message || "Failed to analyze resume" };
    }
}

// --- ACTION: DEEP MARKET ANALYSIS ---
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