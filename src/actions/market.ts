// matchRole removed - use actions/match.ts

export async function getMarketTrends() {
    // Simulated market trends for the pulse bar chart
    return [
        { label: "AI & ML", value: 95 },
        { label: "Rust & Systems", value: 78 },
        { label: "Cloud Arch", value: 88 },
        { label: "Cybersecurity", value: 72 },
        { label: "Blockchain", value: 45 },
        { label: "Frontend", value: 82 }
    ];
}

export async function getTrendingJobs() {
    // For the Market page bento grid
    return [
        { id: "1", title: "AI Agent Architect", company: "Aether Dynamics", location: "Remote", salary: "$180k - $250k", growth: "+12%" },
        { id: "2", title: "Rust Systems Engineer", company: "Vector Scale", location: "San Francisco", salary: "$160k - $220k", growth: "+8%" },
        { id: "3", title: "L3 Infrastructure Lead", company: "Oasis Labs", location: "London", salary: "£120k - £160k", growth: "+15%" },
        { id: "4", title: "Quant Analyst", company: "Prime Hedge", location: "New York", salary: "$200k+", growth: "+5%" }
    ];
}