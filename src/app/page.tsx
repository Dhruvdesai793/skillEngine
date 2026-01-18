'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Magnetic from "@/components/ui/Magnetic";
import { ArrowRight, Terminal, Cpu, Network, Code2 } from "lucide-react";

// --- VISUAL COMPONENTS ---

function CodeRain() {
  // Matrix-style falling code characters for CS/IT vibe
  const streams = Array.from({ length: 20 }).map((_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 5,
    chars: "01<>{}[]"
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {streams.map((s, i) => (
        <motion.div
          key={i}
          className="absolute top-0 text-[10px] font-mono text-lando/40 flex flex-col items-center"
          style={{ left: `${s.x}%` }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {s.chars.split('').map((c, j) => (
            <span key={j} className="my-1">{c}</span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function KineticText({ text }: { text: string }) {
  return (
    <div className="flex overflow-hidden relative">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 200, skewY: 20 }}
          animate={{ y: 0, skewY: 0 }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block hover:text-lando transition-colors duration-300"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

function TechStackTicker() {
  const stack = ["REACT", "NEXT.JS", "PYTHON", "RUST", "TENSORFLOW", "KUBERNETES", "AWS", "DOCKER", "GRAPHQL", "POSTGRES"];
  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-white/5 backdrop-blur-sm py-4">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...stack, ...stack, ...stack].map((tech, i) => (
          <span key={i} className="text-sm font-mono text-white/30 font-bold tracking-widest flex items-center gap-2">
            <span className="w-1 h-1 bg-lando rounded-full" /> {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <main ref={containerRef} className="bg-[#030303] min-h-[400vh] relative selection:bg-lando selection:text-black font-sans">

      {/* --- HERO SECTION --- */}
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black z-0" />
        <CodeRain />

        <motion.div style={{ y, opacity, scale }} className="z-10 text-center flex flex-col items-center max-w-7xl px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <div className="text-[12vw] md:text-[9vw] leading-[0.85] font-black italic tracking-tighter text-white mix-blend-difference mb-6">
              <KineticText text="SKILL ENGINE" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 mt-8"
          >
            <span className="h-px w-12 bg-lando/50" />
            <p className="text-sm md:text-lg font-mono text-lando uppercase tracking-[0.3em]">
              The Career Runtime for CS/IT
            </p>
            <span className="h-px w-12 bg-lando/50" />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-12 animate-bounce">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Scroll to Initialize</p>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="relative z-10 w-full pt-[100vh]">

        {/* SECTION 1: THE PROBLEM (DEBUGGING) */}
        <section className="min-h-screen flex flex-col justify-center bg-black relative border-t border-white/10">
          <TechStackTicker />

          <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20%" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={20} className="text-lando" />
                <span className="font-mono text-xs text-lando">ERROR: CAREER_PATH_NOT_FOUND</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                STOP GUESSING. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">START COMPILING.</span>
              </h2>
              <p className="text-xl text-white/60 font-light leading-relaxed mb-8">
                Traditional hiring is a legacy system. We treat your skills like code—parsing syntax, analyzing libraries, and optimizing your career runtime complexity.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white font-bold text-2xl">98%</h4>
                  <p className="text-xs font-mono text-white/50">ATS REJECTION RATE</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-lando font-bold text-2xl">O(1)</h4>
                  <p className="text-xs font-mono text-white/50">MATCH EFFICIENCY</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-[500px] w-full bg-[#0A0A0A] rounded-3xl border border-white/10 relative overflow-hidden group"
            >
              {/* Fake Terminal UI */}
              <div className="absolute inset-0 p-6 font-mono text-xs text-green-500/80 opacity-50">
                <p>$ skill-engine analyze --deep</p>
                <p className="text-white/50 mt-2">{`> Loading dependencies...`}</p>
                <p className="text-white/50">{`> Parsing React, Node.js, C++ vectors...`}</p>
                <p className="text-white/50">{`> Calculating semantic distance...`}</p>
                <p className="text-lando mt-4">{`> MATCH FOUND: 99.8% COMPATIBILITY`}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: THE ARCHITECTURE */}
        <section className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-lando/50 to-transparent" />

          <div className="max-w-5xl text-center px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">FULL STACK <span className="text-lando">INTELLIGENCE</span></h2>
              <p className="text-white/50 max-w-2xl mx-auto">Engineered for Students, Graduates, and Devs. We decode your GitHub, Resume, and Portfolio to build a high-fidelity vector profile.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Code2, label: "Syntax Analysis", desc: "We read code, not just keywords. Your GitHub commits matter." },
                { icon: Network, label: "Vector Embeddings", desc: "Mapping your skills to 768-dimensional career space." },
                { icon: Cpu, label: "Real-time Benchmarking", desc: "Compare your stack against 100k+ live job descriptions." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-lando/50 hover:bg-white/10 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-black border border-white/20 flex items-center justify-center mb-6 group-hover:border-lando/50 transition-colors">
                    <item.icon className="text-white group-hover:text-lando transition-colors" size={24} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3">{item.label}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center relative bg-black">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          <div className="flex flex-col items-center gap-12 z-10">
            <h2 className="text-6xl md:text-8xl font-black text-white text-center leading-none tracking-tighter">
              READY TO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-lando to-transparent">DEPLOY?</span>
            </h2>

            <Magnetic>
              <Link
                href="/analyze"
                className="group relative inline-flex h-32 w-32 items-center justify-center rounded-full bg-lando text-black transition-all hover:scale-110 hover:shadow-[0_0_40px_rgba(210,255,0,0.4)]"
              >
                <ArrowRight size={40} className="group-hover:-rotate-45 transition-transform duration-300" />
                <span className="absolute -bottom-12 font-mono text-xs text-white/50 tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  EXECUTE ANALYSIS
                </span>
              </Link>
            </Magnetic>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 border-t border-white/10 bg-black text-center">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
            SKILL ENGINE // v2.1.0 // SYSTEM OPTIMIZED
          </p>
        </footer>
      </div>

    </main>
  );
}