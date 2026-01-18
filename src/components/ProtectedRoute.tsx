'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If Firebase finished checking and no user exists, redirect to login
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Display a specialized loader while Firebase resolves the session
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 text-lando animate-spin mb-4" />
                <p className="text-white/30 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                    Authenticating Neural Link...
                </p>
            </div>
        );
    }

    // Protect against flickering: don't render children if there's no user
    if (!user) return null;

    return <>{children}</>;
}