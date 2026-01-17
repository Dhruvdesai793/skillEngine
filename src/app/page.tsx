'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Magnetic from "@/components/ui/Magnetic";
import { ArrowRight } from "lucide-react";

function ParticleField() {
  // Generate 50 random particles for the "100k Job Data" visual
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    z: Math.random() * -1000 - 500,
    size: Math.random() * 4 + 1,
    color: Math.random() > 0.8 ? '#D2FF00' : '#ffffff', // Lando or White
    delay: Math.random() * 2
  }));

  return (
    <div className="absolute inset-0 pointer-events-none perspective-1000 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full opacity-60"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            x: `${p.x}vw`,
            y: `${p.y}vh`,
          }}
          initial={{ z: p.z, opacity: 0 }}
          whileInView={{ z: 0, opacity: [0, 1, 0] }}
          transition={{
            duration: 3,
            delay: p.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}

function KineticText({ text }: { text: string }) {
  const letters = text.split("");

  return (
    <div className="flex overflow-hidden">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 200, skewY: 20 }}
          animate={{ y: 0, skewY: 0 }}
          transition={{
            duration: 0.8,
            delay: i * 0.03, // Kinetic stagger
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
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
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <main ref={containerRef} className="bg-black min-h-[400vh] relative selection:bg-lando selection:text-black">

      {/* Fixed Hero Section */}
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        <ParticleField />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-0" />

        <motion.div style={{ y, opacity, scale }} className="z-10 text-center flex flex-col items-center max-w-5xl px-6">
          <div className="text-[12vw] md:text-[10vw] leading-[0.8] font-black italic tracking-tighter text-white mix-blend-difference mb-8">
            <KineticText text="SKILL_OS" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl font-mono text-lando/80 uppercase tracking-[0.5em] backdrop-blur-sm p-4 rounded-full border border-white/5 bg-black/30"
          >
            Human Potential Vectors
          </motion.p>
        </motion.div>
      </div>

      {/* Narrative Scroll Content */}
      <div className="relative z-10 w-full pt-[100vh]">

        {/* Section 1: The Data */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20%" }}
            >
              <h2 className="text-6xl md:text-8xl font-black text-white/10 mb-6 leading-none">
                100K <br /> <span className="text-white">NODES.</span>
              </h2>
              <p className="text-2xl text-white/60 font-light leading-relaxed">
                The global workforce isn't a list. It's a <span className="text-white font-bold">neural network</span>.
                We scan thousands of data points every second to map the semantic distance between talent and opportunity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-[400px] w-full bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden backdrop-blur-sm"
            >
              {/* Decorative Abstract UI */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-lando/20 rounded-full blur-[60px]" />
              <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-lando/50">
                  // REALTIME_INGESTION_ACTIVE
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: The Gap */}
        <section className="min-h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg border-t border-white/5">
          <div className="max-w-4xl text-center px-6">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-white mb-12"
            >
              BRIDGE THE <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-lando to-white">INFRASTRUCTURE</span> GAP
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { label: "Parse", desc: "Extract DNA from PDF/DOCX" },
                { label: "Vectorize", desc: "Map skills to 768-dim space" },
                { label: "Match", desc: "Find semantic alignment" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-lando/50 transition-colors group"
                >
                  <h3 className="text-lando font-mono text-sm mb-2 group-hover:tracking-widest transition-all">{item.label}</h3>
                  <p className="text-white text-lg font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-lando/10 to-transparent pointer-events-none" />

          <div className="flex flex-col items-center gap-12 z-10">
            <h2 className="text-8xl md:text-9xl font-black text-white mix-blend-overlay opacity-50 text-center leading-none">
              FUTURE <br /> READY
            </h2>

            <Magnetic>
              <Link
                href="/analyze"
                className="group relative inline-flex h-32 w-32 items-center justify-center rounded-full bg-white text-black transition-all hover:scale-110 hover:bg-lando"
              >
                <ArrowRight size={40} className="group-hover:-rotate-45 transition-transform duration-300" />
                <span className="absolute -bottom-10 font-mono text-xs text-white/50 tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  START ANALYSIS
                </span>
              </Link>
            </Magnetic>
          </div>
        </section>
      </div>

    </main>
  );
}
