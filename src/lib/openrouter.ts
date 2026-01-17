export const analyzeWithOpenRouter = async (prompt: string) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
            "X-Title": "Skill Engine Decoder",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "google/gemini-3-flash", // You can switch this to any model!
            "messages": [{ "role": "user", "content": prompt }],
            "response_format": { "type": "json_object" }
        })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
};