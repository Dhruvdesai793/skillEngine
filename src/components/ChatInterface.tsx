'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { Send, Hash, Globe, Cpu, Server, Layers, Code2, Users, MoreVertical, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    timestamp: number;
    room: string;
    role?: string;
}

const CHANNELS = [
    { id: 'global', label: 'Global Relay', icon: Globe, desc: "Public frequency" },
    { id: 'frontend', label: 'Frontend', icon: Layers, desc: "React, UI/UX, CSS" },
    { id: 'backend', label: 'Backend', icon: Server, desc: "Node, Go, DBs" },
    { id: 'ai-ml', label: 'Neural Nets', icon: Cpu, desc: "LLMs, Python, ML" },
    { id: 'rust', label: 'Systems', icon: Code2, desc: "Rust, C++, Low-level" },
];

export default function ChatInterface() {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [activeRoom, setActiveRoom] = useState('global');
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // --- SOCKET INITIALIZATION ---
    useEffect(() => {
        // Initialize socket only once
        const socketInstance = io({
            path: '/api/socket/io',
            addTrailingSlash: false,
            reconnectionAttempts: 5,
        });

        socketInstance.on('connect', () => {
            console.log('>> Socket Connected');
            setIsConnected(true);
            // Join the default room on connect
            socketInstance.emit('join_room', activeRoom);
        });

        socketInstance.on('disconnect', () => {
            console.log('>> Socket Disconnected');
            setIsConnected(false);
        });

        socketInstance.on('receive_message', (data: Message) => {
            setMessages((prev) => {
                // Prevent duplicates if optimistic update matched
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
        });

        socketInstance.on('typing', (userId: string) => {
            setTypingUsers(prev => [...Array.from(new Set([...prev, userId]))]);
        });

        socketInstance.on('stop_typing', (userId: string) => {
            setTypingUsers(prev => prev.filter(id => id !== userId));
        });

        setSocket(socketInstance);
        socketRef.current = socketInstance;

        return () => {
            socketInstance.disconnect();
        };
    }, []); // Empty dependency array = runs once

    // --- ROOM SWITCHING LOGIC ---
    const handleSwitchRoom = (newRoom: string) => {
        if (activeRoom === newRoom || !socket) return;

        // Leave old room, Join new room
        socket.emit('leave_room', activeRoom);
        socket.emit('join_room', newRoom);

        setActiveRoom(newRoom);
        setMessages([]); // Clear chat history for visual cleanliness (or fetch history here)
        setTypingUsers([]);
    };

    // --- AUTO SCROLL ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUsers]);

    // --- SEND MESSAGE ---
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !socket || !user) return;

        socket.emit('stop_typing', activeRoom);

        const msgData: Message = {
            id: Date.now().toString() + Math.random().toString(), // Ensure unique ID
            text: message,
            senderId: user.uid,
            senderName: user.displayName || 'Anonymous',
            timestamp: Date.now(),
            room: activeRoom,
            role: user.phoneNumber === 'RECRUITER' ? 'RECRUITER' : 'USER'
        };

        // Optimistic UI Update
        setMessages((prev) => [...prev, msgData]);

        // Emit to server
        socket.emit('send_message', msgData);
        setMessage('');
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (socket) socket.emit('typing', activeRoom);
    };

    if (!user) return null; // ProtectedRoute handles redirect usually

    return (
        <div className="flex w-full h-full bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">

            {/* --- SIDEBAR (SERVERS) --- */}
            <div className="w-20 md:w-64 bg-black/50 border-r border-white/5 flex flex-col backdrop-blur-xl">
                {/* Server Header */}
                <div className="p-4 border-b border-white/5 hidden md:block">
                    <h2 className="text-white font-bold text-sm tracking-widest uppercase">Frequencies</h2>
                </div>

                {/* Channel List */}
                <div className="flex-1 overflow-y-auto py-4 space-y-2 px-2 md:px-4">
                    {CHANNELS.map((channel) => {
                        const isActive = activeRoom === channel.id;
                        const Icon = channel.icon;
                        return (
                            <button
                                key={channel.id}
                                onClick={() => handleSwitchRoom(channel.id)}
                                className={`
                                    w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-white/10 border border-white/10 text-lando shadow-[0_0_15px_rgba(210,255,0,0.1)]'
                                        : 'hover:bg-white/5 text-white/40 hover:text-white'}
                                `}
                            >
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-lando text-black' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                    <Icon size={18} />
                                </div>
                                <div className="text-left hidden md:block">
                                    <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-white/70'}`}>
                                        {channel.label}
                                    </div>
                                    <div className="text-[10px] text-white/30 font-mono">
                                        {channel.desc}
                                    </div>
                                </div>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-lando rounded-full animate-pulse md:block hidden" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* User Info Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white">{user.displayName?.[0]}</span>
                    </div>
                    <div className="hidden md:block overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
                        <div className="text-[10px] text-lando font-mono">ONLINE</div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CHAT AREA --- */}
            <div className="flex-1 flex flex-col bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 relative">

                {/* Channel Header */}
                <div className="h-16 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <Hash className="text-white/20" size={20} />
                        <div>
                            <h3 className="text-white font-bold">{CHANNELS.find(c => c.id === activeRoom)?.label}</h3>
                            <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                                Connected to socket::{activeRoom}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/30">
                        <Users size={18} />
                        <MoreVertical size={18} />
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
                    <AnimatePresence initial={false}>
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-white/20">
                                <Hash size={48} className="mb-4 opacity-20" />
                                <p className="font-mono text-sm">Beginning of buffer for #{activeRoom}</p>
                            </div>
                        )}

                        {messages.map((msg, i) => {
                            const isMe = msg.senderId === user.uid;
                            const isSequence = i > 0 && messages[i - 1].senderId === msg.senderId;

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'} group`}
                                >
                                    {!isSequence && (
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                                            {msg.senderName[0]}
                                        </div>
                                    )}
                                    {isSequence && <div className="w-8" />} {/* Spacer for alignment */}

                                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                        {!isSequence && !isMe && (
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-xs font-bold text-white/80">{msg.senderName}</span>
                                                <span className="text-[10px] text-white/30 font-mono">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`
                                            px-4 py-2 rounded-2xl text-sm leading-relaxed
                                            ${isMe
                                                ? 'bg-lando text-black rounded-tr-sm shadow-[0_0_15px_rgba(210,255,0,0.1)] font-medium'
                                                : 'bg-white/10 text-white/90 rounded-tl-sm border border-white/5'}
                                        `}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 pb-6 bg-black/20 backdrop-blur-xl border-t border-white/5 relative shrink-0">

                    {/* Typing Indicator */}
                    {typingUsers.length > 0 && (
                        <div className="absolute -top-8 left-6 flex items-center gap-2 text-[10px] font-mono text-lando animate-pulse">
                            <span className="w-1.5 h-1.5 bg-lando rounded-full" />
                            User is typing...
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={message}
                            onChange={handleTyping}
                            onBlur={() => socket?.emit('stop_typing', activeRoom)}
                            placeholder={`Message #${activeRoom}...`}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-lando/50 focus:bg-black/40 transition-all font-mono text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="absolute right-2 top-2 p-2 bg-white/10 text-white rounded-lg hover:bg-lando hover:text-black transition-all disabled:opacity-0 disabled:scale-90"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}