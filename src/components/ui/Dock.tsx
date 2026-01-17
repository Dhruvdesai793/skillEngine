'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Home, Map, Briefcase, BarChart2, Cpu, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

// SKILL_OS Navigation Map
const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/market', label: 'Market', icon: BarChart2 },
    { href: '/analyze', label: 'Analyze', icon: Cpu },
    { href: '/chat', label: 'Chat', icon: MessageSquare }, // Added Chat
    { href: '/roadmap', label: 'Roadmap', icon: Map },
    { href: '/profile', label: 'Profile', icon: User },
];

function DockIcon({ mouseX, href, icon: Icon, label }: { mouseX: any, href: string, icon: any, label: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Reduced expansion range for minimal effect
    const widthSync = useTransform(distance, [-100, 0, 100], [40, 60, 40]);
    // Snappier spring
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

    return (
        <Link href={href} className="flex flex-col items-center gap-2 group relative">
            <motion.div
                ref={ref}
                style={{ width, height: width }}
                className={cn(
                    "rounded-full flex items-center justify-center border transition-all duration-200 relative overflow-hidden",
                    isActive
                        ? 'bg-lando border-lando text-black shadow-[0_0_20px_rgba(210,255,0,0.3)]'
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/30'
                )}
            >
                {/* Gloss/Reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
            </motion.div>

            {/* Active Dot Indicator */}
            {isActive && (
                <motion.div
                    layoutId="activeDock"
                    className="absolute -bottom-2 w-1 h-1 bg-lando rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}

            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
                className={cn(
                    "text-[10px] font-mono tracking-widest uppercase absolute -top-10 pointer-events-none px-2 py-1 rounded bg-black/80 border border-white/10 backdrop-blur-md whitespace-nowrap",
                    isActive ? 'text-lando' : 'text-white'
                )}
            >
                {label}
            </motion.span>
        </Link>
    );
}

export default function Dock() {
    const mouseX = useMotionValue(Infinity);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
                className="flex items-end gap-3 p-3 pb-3 rounded-full bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl relative"
            >
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-full bg-white/5 blur-xl -z-10" />

                {links.map((link) => (
                    <DockIcon key={link.href} mouseX={mouseX} {...link} />
                ))}
            </motion.div>
        </div>
    );
}
