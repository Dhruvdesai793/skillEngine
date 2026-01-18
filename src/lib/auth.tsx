'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from './firebase';

type UserRole = 'USER' | 'RECRUITER';

interface AuthContextType {
    role: UserRole;
    toggleRole: () => void;
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole>('USER');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listens for authentication state changes (login, logout, session restore)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setRole('USER'); // Default role; could be fetched from Firestore if needed
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const toggleRole = () => {
        setRole((prev) => (prev === 'USER' ? 'RECRUITER' : 'USER'));
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ role, toggleRole, user, loading, loginWithGoogle, logout }}>
            {/* We render children immediately. 
                ProtectedRoute will handle the loading UI for private routes. 
            */}
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}