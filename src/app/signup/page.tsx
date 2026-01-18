'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

export default function SignupPage() {
    const { loginWithGoogle, user, loading } = useAuth(); // Use global auth
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push('/profile');
        }
    }, [user, loading, router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            router.push('/profile');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        }
    };

    if (loading) return null; // Prevent flash

    return (
        <main className="min-h-screen flex items-center justify-center bg-black p-6">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black italic text-white mb-2">INITIATE</h1>
                        <p className="text-white/50 text-xs font-mono uppercase tracking-widest">Create New Protocol</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Display Name"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lando transition-colors"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lando transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lando transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-xs font-mono text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-lando text-black font-bold py-3 rounded-xl hover:bg-lime-400 transition-colors flex items-center justify-center gap-2"
                        >
                            CREATE ACCOUNT <ArrowRight size={16} />
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/30 text-xs font-mono">OR</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <button
                        onClick={() => { loginWithGoogle().then(() => router.push('/profile')); }}
                        className="w-full bg-transparent border border-white/20 text-white font-bold py-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                        Sign up with Google
                    </button>

                    <p className="mt-6 text-center text-white/40 text-xs">
                        Already initialized? <Link href="/login" className="text-white hover:underline">Login</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}