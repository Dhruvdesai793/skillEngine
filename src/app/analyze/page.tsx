'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud, Loader2, Cpu, TrendingUp, ShieldAlert,
    Globe, CheckCircle2, AlertTriangle, ArrowRight,
    MapPin, BookOpen, GraduationCap, PlayCircle, ExternalLink, Milestone
} from 'lucide-react';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    Tooltip as RechartsTooltip
} from 'recharts';
import { analyzeResume, analyzeDeepResume } from '@/actions/analyze';
import ProtectedRoute from '@/components/ProtectedRoute';

// --- SUB COMPONENTS ---

// Inside src/app/analyze/page.tsx
const ScoreCard = ({ title, score, color = "text-white" }: { title: string, score: number, color?: string }) => {
    // If the score is less than or equal to 10, assume it's a 1-10 scale and multiply by 10
    const normalizedScore = score <= 10 ? score * 10 : score;

    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all">
            {/* ... existing styles ... */}
            <div className="flex items-baseline gap-1">
                <span className={`text-6xl font-black italic tracking-tighter ${color}`}>
                    {normalizedScore || 0}
                </span>
                <span className="text-white/20 text-xl font-bold">/100</span>
            </div>
        </div>
    );
};

const SkillRadar = ({ data }: { data: any[] }) => {
    // Normalize data: If any score is <= 10, assume a 1-10 scale and multiply by 10
    const normalizedData = data?.map(item => ({
        ...item,
        // If the score is very low, it's likely the AI used a 1-10 scale
        score: item.score <= 10 ? item.score * 10 : item.score
    }));

    return (
        <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={normalizedData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Skills"
                        dataKey="score"
                        stroke="#D2FF00"
                        strokeWidth={2}
                        fill="#D2FF00"
                        fillOpacity={0.2}
                    />
                    <RechartsTooltip
                        contentStyle={{
                            backgroundColor: '#000',
                            border: '1px solid #333',
                            borderRadius: '8px'
                        }}
                        itemStyle={{ color: '#D2FF00' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

const TabButton = ({ active, id, label, icon: Icon, onClick }: any) => (
    <button onClick={onClick} className={`relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${active === id ? 'text-black font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
        {active === id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-lando rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
        <span className="relative z-10 flex items-center gap-2"><Icon size={16} /> {label}</span>
    </button>
);

const CourseCard = ({ course }: { course: any }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 group">
        <div>
            <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-black/40 text-[10px] font-mono uppercase text-white/60 rounded border border-white/10">
                    {course.platform}
                </span>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${course.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                    course.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                    {course.difficulty}
                </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-lando transition-colors">{course.title}</h3>
            <p className="text-sm text-white/50 mb-4 line-clamp-2">{course.reason}</p>
        </div>

        <a
            href={`https://www.google.com/search?q=${course.title} ${course.platform} course`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-black/50 border border-white/10 rounded-xl text-xs font-mono font-bold text-white hover:bg-lando hover:text-black hover:border-lando transition-all"
        >
            <PlayCircle size={14} /> INITIALIZE MODULE
        </a>
    </div>
);

const RoadmapPhase = ({ phase, index }: { phase: any, index: number }) => (
    <div className="relative pl-12 pb-12 last:pb-0">
        {/* Timeline Line */}
        <div className="absolute left-[19px] top-8 bottom-0 w-[2px] bg-white/10" />

        {/* Node */}
        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-[#050505] border-2 border-white/20 flex items-center justify-center z-10">
            <span className="font-mono text-xs font-bold text-lando">{index + 1}</span>
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group hover:border-lando/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">{phase.phase}</h3>
                <span className="px-3 py-1 bg-lando/10 text-lando text-xs font-mono font-bold rounded-full uppercase border border-lando/20">
                    {phase.week}
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-white/40 text-[10px] uppercase font-mono tracking-widest mb-3">Objectives</h4>
                    <ul className="space-y-2">
                        {phase.goals?.map((goal: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-white/80">
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                {goal}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-white/40 text-[10px] uppercase font-mono tracking-widest mb-3">Resources</h4>
                    <div className="flex flex-wrap gap-2">
                        {phase.resources?.map((res: string, i: number) => (
                            <a
                                key={i}
                                href={`https://www.google.com/search?q=${res}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors"
                            >
                                <ExternalLink size={10} /> {res}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function AnalysisPage() {
    const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'COMPLETE'>('IDLE');
    const [data, setData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Sub-states
    const [deepData, setDeepData] = useState<any>(null);
    const [deepLoading, setDeepLoading] = useState(false);

    const handleAnalyze = async (f: File) => {
        setStatus('ANALYZING');
        const fd = new FormData();
        fd.append('resume', f);

        const res = await analyzeResume(fd, 'Software Engineer');

        if (res?.success) {
            setData(res.data);
            setStatus('COMPLETE');
        } else {
            alert("Analysis failed. Please try again.");
            setStatus('IDLE');
        }
    };

    const handleDeepAnalysis = async () => {
        if (!data) return;
        setDeepLoading(true);
        const res = await analyzeDeepResume(data, "Remote / Global");
        if (res?.success) setDeepData(res.data);
        else alert("Market analysis failed. Try again.");
        setDeepLoading(false);
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans selection:bg-lando selection:text-black">

                <AnimatePresence mode="wait">
                    {status === 'IDLE' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="min-h-[80vh] flex flex-col items-center justify-center relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black z-0 pointer-events-none" />
                            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 relative z-10 text-center">SKILL <span className="text-lando">ENGINE</span></h1>
                            <label className="group relative w-full max-w-xl h-64 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-lando/50 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-tr from-lando/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <UploadCloud className="w-16 h-16 text-white/20 group-hover:text-lando transition-colors mb-6 relative z-10" />
                                <p className="font-mono text-sm text-white/50 uppercase tracking-widest relative z-10">Drop Resume Protocol</p>
                                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleAnalyze(e.target.files[0])} />
                            </label>
                        </motion.div>
                    )}
                </AnimatePresence>

                {status === 'ANALYZING' && (
                    <div className="min-h-[80vh] flex flex-col items-center justify-center">
                        <Loader2 className="w-16 h-16 text-lando animate-spin mb-8" />
                        <p className="font-mono text-xs text-lando animate-pulse uppercase tracking-widest">Running Neural Diagnostics...</p>
                    </div>
                )}

                {status === 'COMPLETE' && data && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto pt-8 pb-24">
                        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                            <div>
                                <p className="text-lando font-mono text-xs uppercase tracking-widest mb-2">Analysis Complete</p>
                                <h2 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">{data.fitAnalysis?.seniorityLevel || "Candidate"} Profile</h2>
                            </div>
                            <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto">
                                <TabButton id="overview" label="Intel" icon={Cpu} active={activeTab} onClick={() => setActiveTab('overview')} />
                                <TabButton id="market" label="Market" icon={Globe} active={activeTab} onClick={() => setActiveTab('market')} />
                                <TabButton id="roadmap" label="Roadmap" icon={Milestone} active={activeTab} onClick={() => setActiveTab('roadmap')} />
                                <TabButton id="courses" label="Courses" icon={GraduationCap} active={activeTab} onClick={() => setActiveTab('courses')} />
                            </div>
                        </header>

                        <div className="min-h-[500px]">
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-6">
                                        <ScoreCard title="Resume Score" score={data.resumeScore} color="text-lando" />
                                        <ScoreCard title="ATS Compatibility" score={data.atsScore} />
                                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                                            <h3 className="text-white/40 font-mono text-xs uppercase tracking-widest mb-4">Core Tech Stack</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {data.techStack?.map((t: any, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-black/50 border border-white/10 rounded-lg text-xs font-mono text-white/70">{t.technology}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                                                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-lando" /> Capability Matrix</h3>
                                                <SkillRadar data={data.skillGraph} />
                                            </div>
                                            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col justify-center">
                                                <h3 className="text-white font-bold mb-4">Executive Summary</h3>
                                                <p className="text-white/60 leading-relaxed text-sm">{data.executiveSummary}</p>
                                                <div className="mt-6 pt-6 border-t border-white/10">
                                                    <h4 className="text-xs font-bold text-white mb-2">Verdict</h4>
                                                    <p className="text-lando text-sm font-mono">{data.fitAnalysis?.verdict}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                                            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><ShieldAlert size={18} className="text-red-400" /> Critical Skill Gaps</h3>
                                            <div className="grid gap-4">
                                                {data.skillGaps?.map((gap: any, i: number) => (
                                                    <div key={i} className="flex items-start gap-4 p-4 bg-black/20 rounded-xl border border-white/5">
                                                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-white text-sm">{gap.skill}</h4>
                                                                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-mono rounded uppercase">{gap.severity}</span>
                                                            </div>
                                                            <p className="text-white/50 text-xs mb-2">{gap.impact}</p>
                                                            <p className="text-lando/80 text-xs font-mono">Fix: {gap.fix}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* MARKET TAB */}
                            {activeTab === 'market' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-3xl p-10 min-h-[400px]">
                                    {!deepData ? (
                                        <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                                            <Globe className="w-16 h-16 text-white/10 mb-6" />
                                            <h3 className="text-2xl font-bold text-white mb-2">Deep Market Intel</h3>
                                            <p className="text-white/50 max-w-md mb-8">Generate real-time salary estimates, demand forecasting, and global hireability scores.</p>
                                            <button onClick={handleDeepAnalysis} disabled={deepLoading} className="px-8 py-4 bg-lando text-black font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2">
                                                {deepLoading ? <Loader2 className="animate-spin" /> : <TrendingUp size={18} />}
                                                {deepLoading ? "Scanning Market..." : "Run Market Analysis"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-lando font-mono text-sm uppercase mb-6">Market Position</h3>
                                                <div className="space-y-6">
                                                    <div className="p-6 bg-black/30 rounded-2xl border border-white/5">
                                                        <p className="text-white/40 text-xs uppercase mb-1">Demand Level</p>
                                                        <p className="text-3xl font-bold text-white">{deepData.demandLevel}</p>
                                                    </div>
                                                    <div className="p-6 bg-black/30 rounded-2xl border border-white/5">
                                                        <p className="text-white/40 text-xs uppercase mb-1">Hireability Score</p>
                                                        <p className="text-3xl font-bold text-emerald-400">{deepData.hireabilityVerdict}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lando font-mono text-sm uppercase mb-6">Compensation Estimate</h3>
                                                {deepData.salaryEstimate && (
                                                    <div className="space-y-2">
                                                        {Object.entries(deepData.salaryEstimate).map(([level, salary]: any) => (
                                                            <div key={level} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                                                                <span className="capitalize text-white/60">{level}</span>
                                                                <span className="font-mono font-bold text-white">{salary}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* ROADMAP TAB */}
                            {activeTab === 'roadmap' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/20 rounded-3xl p-6 min-h-[400px]">
                                    <div className="max-w-4xl mx-auto">
                                        <h2 className="text-3xl font-black italic text-white mb-8 flex items-center gap-3">
                                            <Milestone className="text-lando" />
                                            MISSION <span className="text-white/50">TIMELINE</span>
                                        </h2>
                                        <div className="relative">
                                            {data.roadmap?.map((phase: any, index: number) => (
                                                <RoadmapPhase key={index} phase={phase} index={index} />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* COURSES TAB */}
                            {activeTab === 'courses' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/20 rounded-3xl p-6 min-h-[400px]">
                                    <div className="max-w-5xl mx-auto">
                                        <h2 className="text-3xl font-black italic text-white mb-8 flex items-center gap-3">
                                            <GraduationCap className="text-lando" />
                                            KNOWLEDGE <span className="text-white/50">INJECTION</span>
                                        </h2>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {data.courseRecommendations?.map((course: any, index: number) => (
                                                <CourseCard key={index} course={course} />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </main>
        </ProtectedRoute>
    );
}