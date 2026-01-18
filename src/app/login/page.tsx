'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Command } from 'lucide-react';
import Link from 'next/link';

// Background Particles (Reused for consistency)
function ParticleField() {
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-lando/20 rounded-full w-1 h-1"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    animate={{ y: [0, -100], opacity: [0, 1, 0] }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
}

export default function LoginPage() {
    const { loginWithGoogle, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/profile');
        }
    }, [user, loading, router]);

    if (loading) return null;

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#050505] relative selection:bg-lando selection:text-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black" />
            <ParticleField />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    {/* Scanning Bar Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lando to-transparent opacity-50 group-hover:animate-scan" />

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-lando/50 transition-colors">
                            <Command size={32} className="text-white group-hover:text-lando transition-colors" />
                        </div>
                        <h1 className="text-3xl font-black italic text-white tracking-tighter mb-2">IDENTIFY</h1>
                        <p className="text-white/40 font-mono text-xs tracking-[0.2em] uppercase">Authenticate to Access Mainframe</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => { loginWithGoogle().then(() => router.push('/profile')); }}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-lando transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
                        >
                            <svg className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            CONTINUE WITH GOOGLE
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-white/20 font-mono">
                            SECURE CONNECTION // ENCRYPTED END-TO-END
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}