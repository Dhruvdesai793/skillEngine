'use server';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

/**
 * Robust JSON parser to handle potential LLM conversational garbage
 */
function safeJSONParse(raw: string) {
    const cleaned = raw.replace(/```json|```/gi, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('AI response did not contain valid JSON');
    return JSON.parse(cleaned.slice(start, end + 1));
}

/**
 * Core Groq API Caller
 */
async function callGroq(messages: any[], temperature = 0.5) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is missing in your environment variables.");
    }

    const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: MODEL,
            messages,
            temperature,
            response_format: { type: "json_object" }
        })
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API Error: ${res.status} - ${errorText}`);
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;

    if (!content) throw new Error('Empty response from Groq');
    return safeJSONParse(content);
}

/**
 * Fetches real-time technology demand indexing
 */
export async function getMarketTrends() {
    try {
        const data = await callGroq([
            {
                role: 'system',
                content: `You are a Global Tech Market Analyst. 
                Identify 6 high-demand technology sectors for early 2026.
                
                CRITICAL: All "value" scores must be integers between 10 and 100.
                
                Return STRICT JSON ONLY:
                {
                    "trends": [
                        { 
                            "label": "string (e.g. Agentic AI)", 
                            "value": number (10-100), 
                            "growth": "string (e.g. +42.5%)" 
                        }
                    ]
                }`
            },
            { role: 'user', content: "Generate 6 real-time technology demand vectors." }
        ]);

        return data.trends;
    } catch (err) {
        console.error("Market Trends Fetch Failed:", err);
        // Fallback to high-fidelity dummy data if API fails
        return [
            { label: "Agentic AI", value: 98, growth: "+42.5%" },
            { label: "Vector DBs", value: 89, growth: "+24.8%" },
            { label: "Rust Systems", value: 82, growth: "+18.2%" },
            { label: "Zero Trust", value: 76, growth: "+12.4%" },
            { label: "Sovereign Cloud", value: 64, growth: "+8.1%" },
            { label: "Wasm Edge", value: 55, growth: "+15.3%" }
        ];
    }
}

/**
 * Fetches high-velocity job opportunities globally
 */
export async function getTrendingJobs() {
    try {
        const data = await callGroq([
            {
                role: 'system',
                content: `You are an Elite Tech Recruiter.
                Identify 6 high-velocity, high-salary tech roles currently trending in 2026.
                Mix locations: Remote, SF, London, Bangalore, NYC.
                
                Return STRICT JSON ONLY:
                {
                    "jobs": [
                        { 
                            "id": "string", 
                            "title": "string", 
                            "company": "string (Modern-sounding tech company)", 
                            "location": "string", 
                            "salary": "string (e.g. $180k - $240k)", 
                            "growth": "string (e.g. +18%)",
                            "tags": ["string", "string"] 
                        }
                    ]
                }`
            },
            { role: 'user', content: "Generate 6 high-velocity tech opportunities." }
        ]);

        return data.jobs;
    } catch (err) {
        console.error("Trending Jobs Fetch Failed:", err);
        return [
            { id: "1", title: "AI Agent Architect", company: "Aether Dynamics", location: "Remote", salary: "$180k - $250k", growth: "+12%", tags: ["LLMs", "Python"] },
            { id: "2", title: "Rust Systems Engineer", company: "Vector Scale", location: "San Francisco", salary: "$160k - $220k", growth: "+8%", tags: ["Rust", "Wasm"] },
            { id: "3", title: "L3 Infrastructure Lead", company: "Oasis Labs", location: "London", salary: "£120k - £160k", growth: "+15%", tags: ["Cloud", "Go"] },
            { id: "4", title: "Quant Analyst", company: "Prime Hedge", location: "New York", salary: "$200k+", growth: "+5%", tags: ["C++", "Finance"] }
        ];
    }
}