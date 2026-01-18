'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrendingJobs, getMarketTrends } from '@/actions/market';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { TrendingUp, Globe, DollarSign, Zap, Activity, MapPin, Tag } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area, CartesianGrid
} from 'recharts';

// --- SUB-COMPONENTS ---

const MarketTicker = ({ items }: { items: any[] }) => (
    <div className="w-full bg-lando/5 border-y border-lando/10 overflow-hidden py-2 mb-8">
        <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
            {[...items, ...items].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-white/60">
                    <span className="text-lando font-bold">{item.label?.toUpperCase()}</span>
                    <span className="text-emerald-400">{item.growth}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full mx-2" />
                </div>
            ))}
        </motion.div>
    </div>
);

const TrendChart = ({ data }: { data: any[] }) => {
    return (
        <div className="h-full w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D2FF00" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#D2FF00" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="label"
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#D2FF00' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="url(#colorValue)" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default function MarketPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [jobsData, trendsData] = await Promise.all([
                getTrendingJobs(),
                getMarketTrends()
            ]);
            setJobs(jobsData || []);
            setTrends(trendsData || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <main className="min-h-screen bg-[#050505] p-6 md:p-12 pt-32 pb-40 font-sans selection:bg-lando selection:text-black">

            {/* HEADER */}
            <header className="mb-12 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-2 text-lando mb-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lando opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-lando"></span>
                            </span>
                            <p className="font-mono text-xs uppercase tracking-[0.2em]">Live Market Pulse</p>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-lando to-white/50">Vectors</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-white/40 text-[10px] font-mono uppercase">Avg Salary</p>
                            <p className="text-2xl font-bold text-white">$185k</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <p className="text-white/40 text-[10px] font-mono uppercase">Open Roles</p>
                            <p className="text-2xl font-bold text-emerald-400">12.4k</p>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* TICKER */}
            {!loading && <MarketTicker items={trends} />}

            <div className="max-w-7xl mx-auto space-y-8">

                {/* CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 h-[400px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative group"
                    >
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Activity size={18} className="text-lando" />
                                Demand Velocity
                            </h3>
                            <p className="text-white/40 text-xs font-mono mt-1">Real-time skill demand indexing</p>
                        </div>
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-lando border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <TrendChart data={trends} />
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-[400px] bg-lando/10 border border-lando/20 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-lando/20 rounded-full blur-3xl" />
                        <div>
                            <Zap className="text-lando mb-4" size={40} />
                            <h3 className="text-4xl font-black text-white leading-tight mb-2">HYPER GROWTH DETECTED</h3>
                            <p className="text-white/60 text-sm">AI Agents & Rust Infrastructure roles are outperforming market average by 450%.</p>
                        </div>
                        <button className="w-full py-4 bg-lando text-black font-bold rounded-xl hover:scale-[1.02] transition-transform">
                            VIEW REPORT
                        </button>
                    </motion.div>
                </div>

                {/* JOB GRID */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="pt-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <Globe className="text-lando" />
                        High Velocity Opportunities
                    </h2>

                    <BentoGrid className="max-w-7xl mx-auto">
                        {loading ? (
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-64 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
                            ))
                        ) : (
                            jobs.map((job, i) => (
                                <BentoGridItem
                                    key={job.id || i}
                                    className={i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"}
                                    title={
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xl font-bold text-white">{job.title}</span>
                                            <span className="text-emerald-400 font-mono text-xs bg-emerald-400/10 px-2 py-1 rounded">{job.growth}</span>
                                        </div>
                                    }
                                    description={
                                        <div className="space-y-4">
                                            <p className="text-white/60 text-sm">{job.company}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {job.tags?.map((tag: string, j: number) => (
                                                    <span key={j} className="text-[10px] text-white/40 border border-white/10 px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Tag size={8} /> {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    header={
                                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-1 text-white/50 text-xs font-mono">
                                                <MapPin size={12} /> {job.location}
                                            </div>
                                            <div className="flex items-center gap-1 text-lando text-xs font-mono font-bold">
                                                <DollarSign size={12} /> {job.salary}
                                            </div>
                                        </div>
                                    }
                                />
                            ))
                        )}
                    </BentoGrid>
                </motion.div>
            </div>
        </main>
    );
}