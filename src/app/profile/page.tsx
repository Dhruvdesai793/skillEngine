'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { User, Briefcase, Settings, FileText, LogOut, Loader2, UploadCloud, ShieldCheck, Activity } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
    const { role, toggleRole, user, logout } = useAuth();
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Save metadata to user profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                resumeUrl: downloadURL,
                resumeName: file.name,
                updatedAt: new Date()
            }, { merge: true });

            // Optional: You could show a toast notification here
        } catch (error) {
            console.error("Upload failed", error);
        }
        setUploading(false);
    };

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-[#050505] p-6 md:p-24 pt-32 font-sans text-white selection:bg-lando selection:text-black">

                {/* Header Grid */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* User ID Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-lando/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-white/30" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black italic tracking-tight">{user?.displayName || "Anonymous User"}</h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="p-3 rounded-xl border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all text-white/30"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Status Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between"
                    >
                        <div>
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-1">SYSTEM STATUS</p>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <ShieldCheck size={20} className="text-lando" />
                                AUTHENTICATED
                            </h3>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-white/30 mb-2 font-mono">
                                <span>PROFILE_COMPLETION</span>
                                <span>85%</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-lando w-[85%]" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Controls */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Role Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-3xl bg-black/40 border border-white/5 relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="p-3 bg-white/5 rounded-xl text-white">
                                <Briefcase size={24} />
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-mono uppercase text-white/50">
                                MODE_SWITCH
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Active Persona</h3>
                        <p className="text-white/40 text-sm mb-6 relative z-10">Toggle your view between Candidate (Job Seeker) and Recruiter (Hiring Manager).</p>

                        <button
                            onClick={toggleRole}
                            className="relative z-10 flex items-center gap-3 px-1 py-1 bg-black/50 border border-white/10 rounded-xl w-full h-14 relative cursor-pointer"
                        >
                            <motion.div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 border border-white/10 rounded-lg z-0"
                                animate={{ x: role === 'USER' ? 0 : '100%' }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                            <span className={`relative z-10 flex-1 text-center text-xs font-bold transition-colors ${role === 'USER' ? 'text-lando' : 'text-white/30'}`}>CANDIDATE</span>
                            <span className={`relative z-10 flex-1 text-center text-xs font-bold transition-colors ${role === 'RECRUITER' ? 'text-lando' : 'text-white/30'}`}>RECRUITER</span>
                        </button>
                    </motion.div>

                    {/* Resume Upload */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-3xl bg-black/40 border border-white/5 relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-lando/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="p-3 bg-white/5 rounded-xl text-white group-hover:text-lando transition-colors">
                                <FileText size={24} />
                            </div>
                            {uploading && <Loader2 size={16} className="animate-spin text-lando" />}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Vector Source</h3>
                        <p className="text-white/40 text-sm mb-6 relative z-10">Upload your PDF/DOCX to update your semantic profile and re-index your skills.</p>

                        <label className="relative z-10 w-full cursor-pointer group/btn">
                            <div className="w-full h-14 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-lando transition-colors">
                                {uploading ? "INDEXING..." : (
                                    <>
                                        <UploadCloud size={18} />
                                        <span>UPLOAD RESUME</span>
                                    </>
                                )}
                            </div>
                            <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} disabled={uploading} />
                        </label>
                    </motion.div>

                </div>

                {/* Footer Meta */}
                <div className="max-w-5xl mx-auto mt-12 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/20 uppercase">
                    <span>ID: {user?.uid}</span>
                    <span className="flex items-center gap-2">
                        <Activity size={12} />
                        NETWORK: STABLE
                    </span>
                </div>

            </main>
        </ProtectedRoute>
    );
}