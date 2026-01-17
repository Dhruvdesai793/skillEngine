'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { getMarketTrends } from '@/actions/market';

type TrendData = { label: string; value: number };

export default function MarketPulse() {
    const [data, setData] = useState<TrendData[]>([]);

    useEffect(() => {
        getMarketTrends().then(setData);
    }, []);

    if (!data?.length) return (
        <div className="w-full h-full flex flex-col p-6">
            <h3 className="text-xl font-bold font-mono uppercase tracking-widest mb-6 opacity-30">Market Pulse</h3>
            <div className="flex-1 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-t-lando border-white/5 animate-spin" />
            </div>
        </div>
    );

    const maxVal = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full h-full flex flex-col p-6 relative overflow-hidden group">
            {/* Subtle Noise/Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-lando/5 to-transparent pointer-events-none" />

            <h3 className="text-xl font-black font-mono uppercase tracking-[0.2em] mb-8 text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lando animate-pulse" />
                Live Demand
            </h3>

            <div className="flex-1 flex items-end justify-between gap-3 min-h-[140px]">
                {data.map((item, index) => (
                    <div key={item.label} className="flex flex-col items-center gap-4 w-full h-full justify-end group/bar">
                        <div className="relative w-full flex flex-col items-center justify-end h-full">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.value / maxVal) * 100}%` }}
                                transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full bg-gradient-to-t from-lando/80 to-lando rounded-t-md relative group-hover/bar:from-lando transition-all duration-300 shadow-[0_0_20px_rgba(210,255,0,0.1)] group-hover/bar:shadow-[0_0_30px_rgba(210,255,0,0.3)]"
                            >
                                {/* Glow reflection */}
                                <div className="absolute top-0 left-0 right-0 h-[30%] bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-md" />
                            </motion.div>

                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -top-6 text-[10px] font-mono text-lando font-bold"
                            >
                                {item.value}%
                            </motion.span>
                        </div>

                        <span className="text-[10px] font-mono text-white/30 truncate w-full text-center uppercase tracking-tighter group-hover/bar:text-white/60 transition-colors">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
