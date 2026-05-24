"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  formatter?: (val: number) => string;
}

export function AnimatedCounter({ from = 0, to, duration = 1.5, className = "", formatter }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (v) => {
    return formatter ? formatter(Math.round(v)) : Math.round(v).toLocaleString();
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, to, duration]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}
