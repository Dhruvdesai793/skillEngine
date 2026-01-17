'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { Send, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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

export default function ChatInterface() {
    const { user, loginWithGoogle } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [room, setRoom] = useState('general');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socketInstance = io({
            path: '/api/socket/io',
            addTrailingSlash: false,
        });

        socketInstance.on('connect', () => {
            console.log('Connected to socket server');
            setIsConnected(true);
            socketInstance.emit('join_room', room);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected');
            setIsConnected(false);
        });

        socketInstance.on('receive_message', (data: Message) => {
            setMessages((prev) => [...prev, data]);
        });

        socketInstance.on('typing', () => setIsTyping(true));
        socketInstance.on('stop_typing', () => setIsTyping(false));

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [room]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !socket || !user) return;

        socket.emit('stop_typing', room);

        const msgData: Message = {
            id: Date.now().toString(),
            text: message,
            senderId: user.uid,
            senderName: user.displayName || 'Anonymous',
            timestamp: Date.now(),
            room: room,
            role: user.phoneNumber === 'RECRUITER' ? 'RECRUITER' : 'USER' // leveraging phone field or context role for now
        };

        // Optimistic update
        setMessages((prev) => [...prev, msgData]);
        socket.emit('send_message', msgData);
        setMessage('');
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 rounded-2xl border border-white/10">
                <UserIcon className="w-12 h-12 text-white/50 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Login to Chat</h3>
                <p className="text-white/50 mb-6">Join the global talent network.</p>
                <div className="flex gap-4">
                    <Link href="/login" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-lando' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-white font-mono text-sm font-bold">Lobby: {room}</span>
                </div>
                <div className="text-white/50 text-xs font-mono">
                    Logged as: {user.displayName}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                        const isMe = msg.senderId === user.uid;
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, x: isMe ? 20 : -20 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                                        max-w-[80%] p-3 rounded-2xl text-sm
                                        ${isMe
                                            ? 'bg-lando text-black rounded-tr-none'
                                            : msg.role === 'RECRUITER'
                                                ? 'bg-orange-500 text-black rounded-tl-none'
                                                : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                        }
                                    `}
                                >
                                    {!isMe && (
                                        <p className="text-[10px] font-bold opacity-50 mb-1 flex items-center gap-1">
                                            {msg.senderName}
                                            {msg.role === 'RECRUITER' && <span className="bg-black/20 px-1 rounded text-[8px]">RECRUITER</span>}
                                        </p>
                                    )}
                                    <p>{msg.text}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </AnimatePresence>
            </div>

            {/* Typing Indicator */}
            {isTyping && (
                <div className="absolute bottom-20 left-6 z-10">
                    <div className="bg-white/10 text-white/50 px-3 py-1 rounded-full text-xs italic border border-white/5 backdrop-blur-md">
                        Someone is typing...
                    </div>
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            socket?.emit('typing', room);
                        }}
                        onBlur={() => socket?.emit('stop_typing', room)}
                        placeholder="Broadcast message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lando transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="p-3 bg-lando text-black rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
