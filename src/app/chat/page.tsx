'use client';

import ChatInterface from '@/components/ChatInterface';
import { motion } from 'framer-motion';

export default function ChatPage() {
    return (
        <main className="min-h-screen pt-32 p-6 flex flex-col items-center selection:bg-lando selection:text-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl mb-8 text-center"
            >
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-2">
                    GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-lando to-emerald-400">CONNECT</span>
                </h1>
                <p className="text-white/50 font-mono text-sm uppercase tracking-widest">
                    Real-time encrypted neural link established.
                </p>
            </motion.div>

            <ChatInterface />
        </main>
    );
}
