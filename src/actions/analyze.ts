'use server';

import mammoth from 'mammoth';
import pdf from 'pdf-parse-new';

export async function analyzeResume(formData: FormData, targetRole: string) {
    const file = formData.get('resume') as File;
    if (!file) return { error: "No file uploaded" };

    // --- 1. Extraction (Same as before) ---
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
        extractedText = extractedText.replace(/\s+/g, ' ').substring(0, 30000);
    } catch (err) {
        return { error: "Extraction failed." };
    }

    // --- 2. "Architect" Level Analysis ---
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Skill Engine Architect",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [
                    {
                        "role": "system",
                        "content": `You are a Principal Architect and Technical Career Coach.
                        Analyze the resume for the role: "${targetRole}".
                        
                        OUTPUT STRICT JSON. NO MARKDOWN.
                        
                        Schema:
                        {
                            "executiveSummary": "String (Deep insight)",
                            "fitAnalysis": {
                                "matchScore": Number (0-100),
                                "seniorityLevel": "String",
                                "estimatedSalaryRange": "String",
                                "cultureFit": "String"
                            },
                            "radarData": [
                                { "subject": "Coding", "A": Number(0-100), "fullMark": 100 },
                                { "subject": "System Design", "A": Number(0-100), "fullMark": 100 },
                                { "subject": "Communication", "A": Number(0-100), "fullMark": 100 },
                                { "subject": "Leadership", "A": Number(0-100), "fullMark": 100 },
                                { "subject": "Architecture", "A": Number(0-100), "fullMark": 100 }
                            ],
                            "criticalGaps": [
                                { 
                                    "skill": "String", 
                                    "severity": "High/Medium", 
                                    "description": "String (Why it matters)",
                                    "searchQuery": "String (Topic to search for tutorials)"
                                }
                            ],
                            "courseRecommendations": [
                                {
                                    "title": "String (Specific Course Name)",
                                    "platform": "String (Coursera, Udemy, edX, etc.)",
                                    "duration": "String",
                                    "level": "Beginner/Intermediate/Advanced",
                                    "reason": "String (Why this specific course?)"
                                }
                            ],
                            "interviewPrep": [
                                { 
                                    "question": "String (Complex scenario)", 
                                    "type": "System Design/Behavioral/Coding",
                                    "difficulty": "Hard/Medium",
                                    "answerKey": "String (Bullet points on what a perfect answer covers)" 
                                }
                            ],
                            "roadmap": [
                                { 
                                    "id": 1, 
                                    "phase": "String", 
                                    "week": "String", 
                                    "goals": ["String"], 
                                    "resources": ["String (Book/Doc titles)"] 
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