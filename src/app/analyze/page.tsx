'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeResume } from '@/actions/analyze';
import {
    Loader2, UploadCloud, RefreshCcw, ExternalLink,
    Briefcase, Code2, GraduationCap, Mic2, TrendingUp,
    CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, PlayCircle
} from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

// --- SUB-COMPONENTS ---

const Tabs = ({ active, setActive, items }: any) => (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        {items.map((item: any) => (
            <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`
                    px-6 py-3 rounded-t-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                    ${active === item.id
                        ? 'bg-lime-400 text-black font-bold shadow-[0_-5px_20px_rgba(163,230,53,0.2)]'
                        : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'}
                `}
            >
                {item.icon} {item.label}
            </button>
        ))}
    </div>
);

const InterviewCard = ({ q, index }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 text-left flex justify-between items-start gap-4"
            >
                <div>
                    <div className={`text-[10px] font-bold uppercase mb-2 px-2 py-1 inline-block rounded ${q.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {q.type} • {q.difficulty}
                    </div>
                    <h4 className="text-lg font-bold text-white/90">"{q.question}"</h4>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-lime-400" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/20 border-t border-white/5"
                    >
                        <div className="p-6">
                            <p className="text-xs text-lime-400 font-bold uppercase mb-2">Ideal Answer Strategy:</p>
                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{q.answerKey}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const RoadmapStep = ({ step, index }: any) => {
    const [checked, setChecked] = useState(false);
    return (
        <div className={`relative pl-8 pb-12 border-l ${checked ? 'border-lime-400' : 'border-white/10'} last:pb-0 transition-colors duration-500`}>
            <button
                onClick={() => setChecked(!checked)}
                className={`
                    absolute -left-[13px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-10
                    ${checked ? 'bg-lime-400 border-lime-400 scale-110' : 'bg-[#050505] border-white/20 hover:border-lime-400'}
                `}
            >
                {checked && <CheckCircle2 className="w-4 h-4 text-black" />}
            </button>

            <div className={`p-6 rounded-2xl border transition-all ${checked ? 'bg-lime-400/5 border-lime-400/30' : 'bg-white/5 border-white/10'}`}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-bold ${checked ? 'text-lime-400' : 'text-white'}`}>{step.phase}</h3>
                    <span className="font-mono text-xs px-2 py-1 rounded bg-black/20 text-white/50">{step.week}</span>
                </div>

                <div className="space-y-3 mb-4">
                    {step.goals.map((goal: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${checked ? 'bg-lime-400' : 'bg-white/30'}`} />
                            <p className={`text-sm ${checked ? 'text-white/80' : 'text-white/60'}`}>{goal}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                    {step.resources.map((res: string, i: number) => (
                        <a
                            key={i}
                            href={`https://www.google.com/search?q=${res} tutorial`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-lime-400 transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" /> {res}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

export default function AnalysisPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');

    const handleAnalyze = async (file: File) => {
        setLoading(true);
        setResult(null);
        const formData = new FormData();
        formData.append('resume', file);

        const data = await analyzeResume(formData, "Software Engineer");
        if (data?.success) setResult(data.data);
        else alert(data?.error || "Analysis failed");
        setLoading(false);
    };

    const tabs = [
        { id: 'overview', label: 'Stats', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'courses', label: 'Learning Path', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'gaps', label: 'Skill Gaps', icon: <AlertTriangle className="w-4 h-4" /> },
        { id: 'interview', label: 'Interview Sim', icon: <Mic2 className="w-4 h-4" /> },
        { id: 'roadmap', label: 'Mastery Roadmap', icon: <TrendingUp className="w-4 h-4" /> },
    ];

    return (
        <main className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans selection:bg-lime-400 selection:text-black">

            {/* HERO */}
            {!result && (
                <div className="text-center pt-20 mb-12">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        SKILL <span className="text-lime-400">ENGINE</span> ULTRA
                    </h1>
                    <p className="text-white/40 font-mono text-sm">ARCHITECT LEVEL RESUME DECODING</p>
                </div>
            )}

            {/* UPLOAD */}
            <AnimatePresence mode="wait">
                {!result && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
                        <label className="flex flex-col items-center justify-center w-full h-64 rounded-3xl border border-dashed border-white/20 bg-white/5 hover:border-lime-400/50 hover:bg-white/10 transition-all cursor-pointer group">
                            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleAnalyze(e.target.files[0])} />
                            <UploadCloud className="w-12 h-12 text-white/20 group-hover:text-lime-400 transition-colors mb-4" />
                            <span className="font-mono text-xs text-white/50 group-hover:text-white transition-colors">INITIATE SEQUENCE [UPLOAD PDF]</span>
                        </label>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LOADER */}
            {loading && (
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <Loader2 className="w-16 h-16 text-lime-400 animate-spin mb-8" />
                    <p className="font-mono text-xs text-lime-400 animate-pulse">DECODING NEURAL PATHWAYS...</p>
                </div>
            )}

            {/* DASHBOARD */}
            {result && !loading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto pt-8">

                    {/* TOP STATS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-xs text-white/40 uppercase mb-2">Match Score</p>
                            <p className="text-5xl font-black text-lime-400">{result.fitAnalysis.matchScore}%</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-xs text-white/40 uppercase mb-2">Level Detected</p>
                            <p className="text-2xl font-bold">{result.fitAnalysis.seniorityLevel}</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-xs text-white/40 uppercase mb-2">Market Value</p>
                            <p className="text-2xl font-bold text-emerald-400">{result.fitAnalysis.estimatedSalaryRange}</p>
                        </div>
                        <button
                            onClick={() => setResult(null)}
                            className="p-6 bg-red-500/10 hover:bg-red-500/20 rounded-2xl border border-red-500/20 transition-colors flex flex-col items-center justify-center gap-2 group"
                        >
                            <RefreshCcw className="w-6 h-6 text-red-400 group-hover:rotate-180 transition-transform" />
                            <span className="text-xs text-red-400 font-bold uppercase">Reset</span>
                        </button>
                    </div>

                    <Tabs active={activeTab} setActive={setActiveTab} items={tabs} />

                    <div className="min-h-[500px]">

                        {/* 1. OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                        <h3 className="text-lg font-bold mb-4 text-lime-400">Executive Summary</h3>
                                        <p className="text-white/70 leading-relaxed text-lg font-light">{result.executiveSummary}</p>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                        <h3 className="text-lg font-bold mb-4 text-purple-400">Culture Fit</h3>
                                        <p className="text-white/70 leading-relaxed">{result.fitAnalysis.cultureFit}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-3xl border border-white/10 h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.radarData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 12 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Candidate" dataKey="A" stroke="#a3e635" strokeWidth={3} fill="#a3e635" fillOpacity={0.4} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* 2. COURSE RECOMMENDATIONS */}
                        {activeTab === 'courses' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {result.courseRecommendations.map((course: any, i: number) => (
                                    <div key={i} className="flex flex-col bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-lime-400/50 transition-all group">
                                        <div className="mb-4">
                                            <span className="text-[10px] font-mono uppercase bg-black/40 px-2 py-1 rounded text-white/50">{course.platform}</span>
                                            <span className="ml-2 text-[10px] font-mono uppercase bg-blue-500/10 px-2 py-1 rounded text-blue-400">{course.level}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-lime-400 transition-colors">{course.title}</h3>
                                        <p className="text-sm text-white/50 mb-6 flex-grow">{course.reason}</p>

                                        <a
                                            href={`https://www.google.com/search?q=${course.title} ${course.platform} course`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition-colors"
                                        >
                                            <PlayCircle className="w-4 h-4" /> Start Learning
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 3. SKILL GAPS */}
                        {activeTab === 'gaps' && (
                            <div className="space-y-4">
                                {result.criticalGaps.map((gap: any, i: number) => (
                                    <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white/5 border border-red-500/20 rounded-2xl hover:bg-white/10 transition-colors">
                                        <div className="p-4 bg-red-500/10 rounded-xl">
                                            <AlertTriangle className="w-6 h-6 text-red-400" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-xl font-bold text-white">{gap.skill}</h4>
                                                <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">{gap.severity} Priority</span>
                                            </div>
                                            <p className="text-white/60 text-sm">{gap.description}</p>
                                        </div>
                                        <a
                                            href={`https://www.youtube.com/results?search_query=${gap.searchQuery} tutorial`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 rounded-xl border border-white/20 text-white font-mono text-xs hover:bg-white hover:text-black transition-colors whitespace-nowrap"
                                        >
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 4. INTERVIEW SIM */}
                        {activeTab === 'interview' && (
                            <div className="grid gap-4 max-w-4xl mx-auto">
                                {result.interviewPrep.map((q: any, i: number) => (
                                    <InterviewCard key={i} q={q} index={i} />
                                ))}
                            </div>
                        )}

                        {/* 5. INTERACTIVE ROADMAP */}
                        {activeTab === 'roadmap' && (
                            <div className="max-w-3xl mx-auto pl-4">
                                {result.roadmap.map((step: any, i: number) => (
                                    <RoadmapStep key={i} step={step} index={i} />
                                ))}
                            </div>
                        )}

                    </div>
                </motion.div>
            )}
        </main>
    );
}