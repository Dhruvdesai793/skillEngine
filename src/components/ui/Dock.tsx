'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, Cpu, User, MessageSquare, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// SKILL ENGINE Navigation Map
const links = [
    { href: '/', label: 'Command', icon: Home },
    { href: '/market', label: 'Market Vectors', icon: BarChart2 },
    { href: '/analyze', label: 'Neural Analyze', icon: Cpu },
    { href: '/chat', label: 'Global Relay', icon: MessageSquare },
    { href: '/profile', label: 'Identity', icon: User },
];

function DockIcon({ mouseX, href, icon: Icon, label }: { mouseX: any, href: string, icon: any, label: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    const [isHovered, setHovered] = useState(false);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Precision scaling: Tighter range for a "mechanical" feel
    const widthSync = useTransform(distance, [-120, 0, 120], [44, 56, 44]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

    return (
        <Link href={href} className="relative group">
            <motion.div
                ref={ref}
                style={{ width, height: width }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
                className={cn(
                    "rounded-2xl flex items-center justify-center border relative overflow-hidden transition-colors duration-300 z-10",
                    isActive
                        ? 'bg-lando border-lando text-black shadow-[0_0_20px_rgba(210,255,0,0.3)]'
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white'
                )}
            >
                {/* Active "Pilot Light" Indicator */}
                {isActive && (
                    <motion.div
                        layoutId="activeGlow"
                        className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-50"
                    />
                )}

                <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className={cn(
                        "relative z-10 transition-all duration-300",
                        isActive ? "scale-100" : "scale-90 group-hover:scale-100"
                    )}
                />
            </motion.div>

            {/* Tactical Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -12, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#050505] border border-white/10 rounded-lg shadow-xl backdrop-blur-md z-0 pointer-events-none"
                    >
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span className={cn("w-1 h-1 rounded-full", isActive ? "bg-lando animate-pulse" : "bg-white/30")} />
                            <span className="text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase">
                                {label}
                            </span>
                        </div>
                        {/* Decorative connector triangle */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#050505] border-r border-b border-white/10 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mirror Reflection Effect for Floor */}
            {isActive && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-lando/20 blur-lg rounded-full" />
            )}
        </Link>
    );
}

export default function Dock() {
    const mouseX = useMotionValue(Infinity);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 perspective-[1000px]">
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                initial={{ y: 100, opacity: 0, rotateX: 20 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 120, damping: 15 }}
                className="flex items-end gap-3 p-3 rounded-3xl bg-[#030303]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/5 relative"
            >
                {/* Inner Bevel Highlight */}
                <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />

                {links.map((link) => (
                    <DockIcon key={link.href} mouseX={mouseX} {...link} />
                ))}

                {/* Decorative Endcaps (Optional Tech Detail) */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-white/10 rounded-full" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-white/10 rounded-full" />
            </motion.div>
        </div>
    );
}