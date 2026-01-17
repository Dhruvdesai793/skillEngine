'use server';

import mammoth from 'mammoth';
import pdf from 'pdf-parse-new';

export async function analyzeResume(formData: FormData, targetRole: string) {
    const file = formData.get('resume') as File;
    if (!file) return { error: "No file uploaded" };

    // --- 1. Extraction Phase ---
    let extractedText = "";
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        if (file.type === "application/pdf") {
            const data = await pdf(buffer);
            extractedText = data.text;
        } else {
            const data = await mammoth.extractRawText({ buffer });
            extractedText = data.value;
        }
        // Increase context window for deep analysis
        extractedText = extractedText.replace(/\s+/g, ' ').substring(0, 35000);
    } catch (err) {
        return { error: "Extraction failed." };
    }

    // --- 2. "Market Architect" Analysis Phase ---
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Skill Engine Ultra",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [
                    {
                        "role": "system",
                        "content": `You are a Principal Engineering Architect & FAANG Hiring Committee Member.
                        Perform a deep-dive market analysis of the resume for the role: "${targetRole}".

                        OUTPUT STRICT JSON (No Markdown). SCHEMA:
                        {
                            "executiveSummary": "String (Professional, critical insight)",
                            "fitAnalysis": {
                                "matchScore": Number (0-100),
                                "seniorityLevel": "String (e.g., L3/Junior, L5/Senior)",
                                "cultureFit": "String (Soft skills & values alignment)"
                            },
                            "marketAnalysis": {
                                "demandLevel": "Very High/High/Moderate/Low",
                                "marketOutlook": "String (Future trends for this profile)",
                                "salaryEstimation": {
                                    "range": "String (e.g. '$120k - $160k')",
                                    "topTierBenchmark": "String (e.g. 'FAANG pays ~$200k for this level')",
                                    "locationFactor": "String (Remote/Hub availability)"
                                }
                            },
                            "dsaAnalysis": {
                                "overallScore": Number (0-100),
                                "feedback": "String (Critique on algorithmic depth)",
                                "topics": [
                                    { "topic": "Arrays/Strings", "score": Number (0-100) },
                                    { "topic": "Trees/Graphs", "score": Number (0-100) },
                                    { "topic": "DP/Recursion", "score": Number (0-100) },
                                    { "topic": "System Design", "score": Number (0-100) }
                                ]
                            },
                            "portfolioAnalysis": {
                                "sentiment": "Positive/Neutral/Needs Work",
                                "projectQuality": "String (Analysis of complexity/impact)",
                                "highlights": ["String", "String"]
                            },
                            "radarData": [
                                { "subject": "Coding Standards", "A": Number(0-100), "fullMark": 100 },
                                { "subject": "Architecture", "A": Number(0-100), "fullMark": 100 },
                                { "subject": "Communication", "A": Number(0-100), "fullMark": 100 },
                                { "subject": "Leadership", "A": Number(0-100), "fullMark": 100 },
                                { "subject": "Tooling/DevOps", "A": Number(0-100), "fullMark": 100 }
                            ],
                            "criticalGaps": [
                                { 
                                    "skill": "String", 
                                    "severity": "High/Medium", 
                                    "description": "String",
                                    "searchQuery": "String"
                                }
                            ],
                            "courseRecommendations": [
                                { "title": "String", "platform": "String", "reason": "String" }
                            ],
                            "interviewPrep": [
                                { 
                                    "question": "String", 
                                    "type": "Coding/System Design/Behavioral",
                                    "difficulty": "Hard/Medium",
                                    "answerKey": "String (Detailed bullet points)" 
                                }
                            ],
                            "roadmap": [
                                { 
                                    "id": 1, 
                                    "phase": "String", 
                                    "week": "String", 
                                    "goals": ["String"], 
                                    "resources": ["String"] 
                                }
                            ]
                        }`
                    },
                    {
                        "role": "user",
                        "content": `Resume Text: ${extractedText}`
                    }
                ],
                "response_format": { "type": "json_object" }
            })
        });

        const result = await response.json();
        if (result.error) throw new Error(result.error.message);

        let content = result.choices[0].message.content;
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return { success: true, data: JSON.parse(content) };

    } catch (error: any) {
        console.error("Analysis Failed:", error);
        return { error: "Analysis failed. Try again." };
    }
}