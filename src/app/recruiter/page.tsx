'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/utils';
import { Users, MapPin, Search } from 'lucide-react';

function HeatmapVisualizer() {
    // Simulated vector density points
    const points = Array.from({ length: 40 }).map((_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        intensity: Math.random(),
        delay: Math.random() * 2
    }));

    return (
        <div className="relative w-full h-[500px] bg-black/40 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Heatmap Points */}
            {points.map((p, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: p.intensity * 2, opacity: p.intensity * 0.8 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: p.delay
                    }}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    className="absolute w-12 h-12 bg-lando/30 rounded-full blur-xl"
                />
            ))}

            {/* Overlay Text */}
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <MapPin className="text-lando" size={18} />
                    Talent Density
                </h3>
                <p className="text-white/40 text-xs font-mono">Global Vector Distribution</p>
            </div>

            <div className="absolute bottom-6 right-6 z-10 flex gap-2">
                <span className="px-2 py-1 bg-black/50 border border-white/10 rounded text-[10px] text-white/50 font-mono">HUB: SAN FRANCISCO</span>
                <span className="px-2 py-1 bg-black/50 border border-white/10 rounded text-[10px] text-white/50 font-mono">HUB: LONDON</span>
            </div>
        </div>
    );
}

export default function RecruiterPage() {
    return (
        <main className="min-h-screen p-8 md:p-24 pt-32 pb-40">
            <header className="mb-12 max-w-7xl mx-auto flex justify-between items-end">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-2"
                    >
                        COMMAND CENTER
                    </motion.h1>
                    <p className="text-white/50 font-mono text-sm uppercase tracking-widest">
                        Accessing Global Talent Pool
                    </p>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-white/50 text-sm">
                        <Search size={14} />
                        <span className="font-mono">Search Vectors...</span>
                    </div>
                </div>
            </header>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-white/50 font-mono text-xs uppercase mb-1">Active Pipelines</p>
                        <h3 className="text-3xl font-bold text-white">12</h3>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-white/50 font-mono text-xs uppercase mb-1">Total Candidates</p>
                        <h3 className="text-3xl font-bold text-white">1,420</h3>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-white/50 font-mono text-xs uppercase mb-1">Avg Match Score</p>
                        <h3 className="text-3xl font-bold text-lando">87%</h3>
                    </motion.div>
                </div>

                {/* Density Map */}
                <motion.div variants={fadeInUp}>
                    <HeatmapVisualizer />
                </motion.div>

                {/* Candidate List (Simplified) */}
                <motion.div variants={fadeInUp}>
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Users className="text-white/50" size={18} />
                        Recent Matches
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-lando/30 transition-colors flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800" />
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Candidate #{1024 + i}</h4>
                                        <p className="text-white/40 text-xs font-mono">Senior React Engineer • 9{8 - i}% Match</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-lando/10 text-lando text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    VIEW PROFILE
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}
