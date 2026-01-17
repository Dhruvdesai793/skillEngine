'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ScrollSection({ children, index }: { children: React.ReactNode, index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0.1, 0.5, 0.8], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.8], [0.8, 1, 0.8]);
    const y = useTransform(scrollYProgress, [0.1, 0.5, 0.8], [50, 0, -50]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity, scale, y }}
            className="min-h-screen flex items-center justify-center snap-center px-4"
        >
            <div className="max-w-4xl text-center">
                {children}
            </div>
        </motion.section>
    );
}
