'use client';

import ChatInterface from '@/components/ChatInterface';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ChatPage() {
    return (
        <ProtectedRoute>
            <main className="h-screen w-full bg-[#050505] text-white flex flex-col pt-24 pb-6 px-4 md:px-8 selection:bg-lando selection:text-black overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center justify-between shrink-0"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white flex items-center gap-2">
                            NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-lando to-emerald-400">NEXUS</span>
                        </h1>
                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest hidden md:block">
                            Encrypted Global Communication Relay // UNDER DEVELOPMENT
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-xs font-mono text-emerald-500 font-bold">SYSTEM ONLINE</span>
                    </div>
                </motion.div>

                <div className="flex-1 min-h-0">
                    <ChatInterface />
                </div>
            </main>
        </ProtectedRoute>
    );
}