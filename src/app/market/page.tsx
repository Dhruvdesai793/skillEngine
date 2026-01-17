'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTrendingJobs } from '@/actions/market';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import MarketPulse from '@/components/dashboard/MarketPulse';
import { fadeInUp, staggerContainer } from '@/lib/utils';
import { TrendingUp, Globe, DollarSign, Zap } from 'lucide-react';

export default function MarketPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTrendingJobs().then(data => {
            setJobs(data);
            setLoading(false);
        });
    }, []);

    return (
        <main className="min-h-screen p-8 md:p-24 pt-32 pb-40">
            <header className="mb-16 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <p className="text-lando font-mono text-sm uppercase tracking-[0.4em] mb-4">Market Intelligence</p>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.8]">
                        Global <br /> <span className="text-lando">Trend Vectors</span>
                    </h1>
                </motion.div>
            </header>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-8"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Market Pulse Widget */}
                    <motion.div variants={fadeInUp} className="lg:col-span-2 h-[400px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden group">
                        <MarketPulse />
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div variants={fadeInUp} className="lg:col-span-1 grid grid-cols-1 gap-4">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-center">
                            <Zap className="text-lando mb-4" size={32} />
                            <h3 className="text-4xl font-black text-white">450%</h3>
                            <p className="text-white/40 font-mono text-xs uppercase">AI Role Growth YoY</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-center">
                            <Globe className="text-blue-400 mb-4" size={32} />
                            <h3 className="text-4xl font-black text-white">12,402</h3>
                            <p className="text-white/40 font-mono text-xs uppercase">Remote Vectors Open</p>
                        </div>
                    </motion.div>
                </div>

                {/* Trending Jobs Grid */}
                <motion.div variants={fadeInUp} className="pt-12">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <TrendingUp className="text-lando" />
                        High Velocity Roles
                    </h2>

                    <BentoGrid>
                        {loading ? (
                            [1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-48 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
                            ))
                        ) : (
                            jobs.map((job, i) => (
                                <BentoGridItem
                                    key={job.id || i}
                                    className={i % 4 === 0 || i % 4 === 3 ? "md:col-span-2" : "md:col-span-1"}
                                    title={job.title}
                                    description={job.company}
                                    header={
                                        <div className="flex flex-col gap-4 h-full justify-between p-2">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-mono text-white/50 border border-white/10 px-2 py-1 rounded bg-black/20 uppercase">
                                                    {job.location}
                                                </span>
                                                <span className="text-lando font-black text-xs">
                                                    {job.growth}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                                <DollarSign size={14} className="text-lando" />
                                                {job.salary}
                                            </div>
                                        </div>
                                    }
                                />
                            ))
                        )}
                    </BentoGrid>
                </motion.div>
            </motion.div>
        </main>
    );
}