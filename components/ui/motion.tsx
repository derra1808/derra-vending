"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function Counter({ value, suffix = "", duration = 2 }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = value / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

interface SectionHeaderProps {
  tag: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}

export function SectionHeader({ tag, title, subtitle, light }: SectionHeaderProps) {
  return (
    <Reveal className="mx-auto mb-16 max-w-3xl text-center">
      <span
        className={`mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] ${
          light ? "text-gold" : "text-gold"
        }`}
      >
        {tag}
      </span>
      <h2
        className={`font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl ${
          light ? "text-cream" : "text-cream"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
