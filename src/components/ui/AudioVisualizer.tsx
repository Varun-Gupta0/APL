"use client";

import { motion } from "framer-motion";

export function AudioVisualizer() {
  const bars = Array.from({ length: 12 });

  return (
    <div className="flex h-8 items-end gap-[2px]">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-t-sm bg-[#D4A94D] shadow-[0_0_8px_rgba(212,169,77,0.5)]"
          animate={{
            height: ["20%", "100%", "40%", "80%", "30%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
