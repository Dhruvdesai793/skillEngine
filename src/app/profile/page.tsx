'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { User, Briefcase, Settings, FileText } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

export default function ProfilePage() {
    const { role, toggleRole, user } = useAuth();
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Save metadata to user profile
            await setDoc(doc(db, "users", user.uid), {
                resumeUrl: downloadURL,
                resumeName: file.name,
                updatedAt: new Date()
            }, { merge: true });

            alert("Resume uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Try again.");
        }
        setUploading(false);
    };

    return (
        <main className="min-h-screen p-24 pt-32 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-lando/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border-2 border-white/10 flex items-center justify-center">
                        <User size={32} className="text-white/50" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{user?.displayName || "User"}</h1>
                        <p className="text-white/50 font-mono text-sm">{user?.email}</p>
                    </div>
                    <div className="ml-auto p-2 rounded-full border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                        <Settings size={20} className="text-white/50" />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Role Toggle */}
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-black/20 border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-lando/10 rounded-lg text-lando">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Active Persona</h3>
                                <p className="text-white/40 text-xs mt-1">Switch between Candidate and Recruiter views.</p>
                            </div>
                        </div>

                        <button
                            onClick={toggleRole}
                            className="flex items-center gap-3 px-1 py-1 bg-black/50 border border-white/10 rounded-full w-48 relative cursor-pointer"
                        >
                            <motion.div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-lando rounded-full z-0 shadow-[0_0_15px_rgba(210,255,0,0.3)]"
                                animate={{ x: role === 'USER' ? 0 : '100%' }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                            <span className={`relative z-10 flex-1 text-center text-xs font-bold transition-colors ${role === 'USER' ? 'text-black' : 'text-white/50'}`}>USER</span>
                            <span className={`relative z-10 flex-1 text-center text-xs font-bold transition-colors ${role === 'RECRUITER' ? 'text-black' : 'text-white/50'}`}>RECRUITER</span>
                        </button>
                    </div>

                    {/* CV Upload */}
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-black/20 border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg text-white">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Resumé Protocol</h3>
                                <p className="text-white/40 text-xs mt-1">Upload your vector source (PDF/DOCX).</p>
                            </div>
                        </div>

                        <label className="cursor-pointer px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-white transition-colors flex items-center gap-2">
                            {uploading ? "UPLOADING..." : "UPLOAD NEW"}
                            <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>

            </motion.div>
        </main>
    );
}
