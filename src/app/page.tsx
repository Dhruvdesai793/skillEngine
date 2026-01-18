'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Magnetic from "@/components/ui/Magnetic";
import { ArrowRight, Terminal, Cpu, Network, Scan, Activity, Code2, AlertTriangle, CheckCircle2 } from "lucide-react";

// --- VISUAL COMPONENTS ---

function CodeRain() {
  const [streams, setStreams] = useState<any[]>([]);

  useEffect(() => {
    // Deterministic generation
    const s = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 5,
      chars: "01<>{}[]SKILL_ENGINE_INIT"
    }));
    setStreams(s);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07]">
      {streams.map((s) => (
        <motion.div
          key={s.id}
          className="absolute top-0 text-[10px] font-mono text-lando/60 flex flex-col items-center writing-vertical-rl"
          style={{ left: `${s.x}%` }}
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: '120vh', opacity: [0, 1, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {s.chars.split('').map((c: string, j: number) => (
            <span key={j} className="my-1 rotate-90">{c}</span>
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

function SystemStatus({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const width = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

  // Dynamic Status Text based on scroll position
  const [status, setStatus] = useState("INITIALIZING KERNEL...");

  // We use a listener to update state (since useTransform returns a motion value)
  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (latest) => {
      if (latest < 0.2) setStatus("SYSTEM_READY // WAITING_FOR_INPUT");
      else if (latest < 0.45) setStatus("WARNING: CRITICAL_CONTEXT_LOSS DETECTED");
      else if (latest < 0.7) setStatus("EXECUTING_PATCH: SKILL_VECTORIZATION_v2");
      else setStatus("OPTIMIZATION_COMPLETE // READY_TO_DEPLOY");
    });
    return () => unsubscribe();
  }, [scrollProgress]);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 left-6 right-6 z-50 pointer-events-none mix-blend-difference"
    >
      <div className="flex justify-between items-end mb-2">
        <p className="font-mono text-[10px] text-white uppercase tracking-widest bg-white/10 px-2 py-1 backdrop-blur-md rounded">
          {status}
        </p>
        <p className="font-mono text-[10px] text-white">SYS_INTEGRITY</p>
      </div>
      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div style={{ width }} className="h-full bg-white" />
      </div>
    </motion.div>
  );
}

// --- MAIN PAGE ---

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Smooth out the scroll value for smoother animations
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // --- PARALLAX TRANSFORMS ---
  const heroScale = useTransform(smoothScroll, [0, 0.2], [1, 1.5]);
  const heroOpacity = useTransform(smoothScroll, [0, 0.2], [1, 0]);
  const bgParallax = useTransform(smoothScroll, [0, 1], ["0%", "20%"]); // Subtle bg movement

  // Stage 1 Transforms
  const splitLeft = useTransform(smoothScroll, [0.15, 0.35], [0, -100]);
  const splitRight = useTransform(smoothScroll, [0.15, 0.35], [0, 100]);
  const glitchOpacity = useTransform(smoothScroll, [0.2, 0.3], [0, 1]);

  // Stage 2 Transforms (Mechanical Rotation)
  const gearRotate = useTransform(smoothScroll, [0.4, 0.7], [0, 360]);
  const reverseGear = useTransform(smoothScroll, [0.4, 0.7], [0, -180]);

  return (
    <main ref={containerRef} className="bg-[#030303] min-h-[500vh] relative selection:bg-lando selection:text-black font-sans">

      <SystemStatus scrollProgress={smoothScroll} />

      {/* --- STAGE 0: INITIALIZATION (HERO) --- */}
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden pointer-events-none z-0">
        <motion.div style={{ y: bgParallax }} className="absolute inset-0">
          <CodeRain />
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black opacity-90" />

        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="z-10 text-center flex flex-col items-center max-w-7xl px-6">
          <div className="text-[12vw] md:text-[9vw] leading-[0.85] font-black italic tracking-tighter text-white mix-blend-difference mb-8">
            <KineticText text="SKILL ENGINE" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 mt-4"
          >
            <div className="h-px w-12 bg-white/20" />
            <p className="text-sm md:text-lg font-mono text-lando uppercase tracking-[0.3em] flex items-center gap-2">
              <Terminal size={14} /> The Career Runtime
            </p>
            <div className="h-px w-12 bg-white/20" />
          </motion.div>
        </motion.div>
      </div>

      {/* --- SCROLL NARRATIVE --- */}
      <div className="relative z-10 w-full pt-[100vh]">

        {/* STAGE 1: THE BUG (LEGACY SYSTEMS) */}
        <section className="min-h-screen flex items-center justify-center relative bg-[#050505] border-t border-white/5 overflow-hidden">
          <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="flex items-center gap-2 text-red-500 font-mono text-xs tracking-widest uppercase mb-4">
                <AlertTriangle size={14} />
                Runtime Error
              </div>

              {/* SPLIT ANIMATION TITLE */}
              <div className="relative text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                <motion.div style={{ x: splitLeft, opacity: 1 }}>THE SYSTEM</motion.div>
                <div className="flex gap-4">
                  <motion.span style={{ x: splitLeft }} className="inline-block text-white/50">IS</motion.span>
                  <span className="relative inline-block text-red-600">
                    BROKEN.
                    <motion.span
                      style={{ opacity: glitchOpacity }}
                      className="absolute inset-0 text-white blur-[2px] animate-pulse"
                    >
                      BROKEN.
                    </motion.span>
                  </span>
                </div>
              </div>

              <p className="text-xl text-white/50 font-light leading-relaxed mb-8">
                Traditional hiring treats you like a flat text file. It misses your context, your potential, and your semantic depth.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="relative p-8 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-white/30 space-y-2 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-scan" />
              <p>{`> Parsing resume.pdf...`}</p>
              <p className="text-red-400">{`> ERROR: Keyword mismatch on line 42`}</p>
              <p className="text-red-400">{`> ERROR: 'Leadership' context lost`}</p>
              <p>{`> Attempting fallback... failed.`}</p>
              <p className="text-white/10 mt-4">... Connection terminated by host.</p>
            </motion.div>
          </div>
        </section>

        {/* STAGE 2: THE PATCH (OUR ANALYSIS) */}
        <section className="min-h-screen flex items-center justify-center relative bg-black">
          <div className="max-w-7xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              className="order-2 md:order-1 relative h-[500px] w-full bg-[#080808] rounded-3xl border border-white/10 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

              {/* SCROLL-LINKED ROTATION */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Outer Ring - Driven by Scroll */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-lando/30"
                    style={{ rotate: gearRotate }}
                  />
                  {/* Inner Ring - Reverse Driven */}
                  <motion.div
                    className="absolute inset-4 rounded-full border border-dashed border-white/20"
                    style={{ rotate: reverseGear }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scan size={48} className="text-lando animate-pulse" />
                  </div>

                  {/* Floating Labels */}
                  {['Python', 'React', 'System_Design', 'Leadership'].map((skill, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-[#0A0A0A] border border-white/10 px-3 py-1 rounded-full text-[10px] text-white font-mono"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.2 }}
                      style={{
                        top: `${50 + Math.sin(i * 1.5) * 45}%`,
                        left: `${50 + Math.cos(i * 1.5) * 45}%`,
                      }}
                    >
                      {skill} :: {(85 + i * 3)}%
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 text-lando font-mono text-xs tracking-widest uppercase mb-4">
                <Code2 size={14} />
                Patch Applied
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                FULL STACK <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-lando to-white">VISIBILITY.</span>
              </h2>
              <p className="text-xl text-white/50 font-light leading-relaxed mb-8">
                We don't read; we analyze. Our engine decompiles your experience into a 768-dimensional vector graph, finding semantic matches that keywords miss.
              </p>
              <div className="flex gap-4">
                <div className="px-6 py-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-2xl font-bold text-white">99.8%</h4>
                  <p className="text-[10px] uppercase text-white/40">Match Accuracy</p>
                </div>
                <div className="px-6 py-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-2xl font-bold text-lando">O(1)</h4>
                  <p className="text-[10px] uppercase text-white/40">Search Time</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STAGE 3: RECOMPILATION (ROADMAP) */}
        <section className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
          <div className="text-center mb-16 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-white mb-4"
            >
              RECOMPILE YOUR <span className="text-lando">FUTURE</span>
            </motion.h2>
            <p className="text-white/40 max-w-xl mx-auto">Automated career pathing based on real-time market vectors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-6 relative z-10">
            {[
              { icon: Scan, title: "1. Audit", desc: "Upload resume for instant gap analysis." },
              { icon: Network, title: "2. Vectorize", desc: "Compare against 100k+ live job nodes." },
              { icon: Cpu, title: "3. Upgrade", desc: "Get specific course injections to fix bugs." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-lando/50 transition-all group cursor-default"
              >
                <div className="w-12 h-12 bg-black rounded-xl border border-white/20 flex items-center justify-center mb-6 group-hover:border-lando transition-colors">
                  <step.icon className="text-white group-hover:text-lando" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* STAGE 4: DEPLOYMENT (CTA) */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center relative bg-black border-t border-white/10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          <div className="relative z-10 flex flex-col items-center gap-12 text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-4 leading-none">
                READY TO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-lando to-transparent">DEPLOY?</span>
              </h2>
            </motion.div>

            <Magnetic>
              <Link
                href="/analyze"
                className="group relative inline-flex h-32 w-32 items-center justify-center rounded-full bg-lando text-black transition-all hover:scale-110 hover:shadow-[0_0_50px_rgba(210,255,0,0.5)]"
              >
                <ArrowRight size={40} className="group-hover:-rotate-45 transition-transform duration-300" />
                <span className="absolute -bottom-12 font-mono text-xs text-white/50 tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  INITIALIZE
                </span>
              </Link>
            </Magnetic>
          </div>
        </section>

        <footer className="py-8 bg-black border-t border-white/10 text-center">
          <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
            Skill Engine © 2026 // End of Line
          </p>
        </footer>

      </div>

    </main>
  );
}