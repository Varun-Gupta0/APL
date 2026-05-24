"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FanMeter({ approvalRating }: { approvalRating: number }) {
  const [offset, setOffset] = useState(364.4); // circumference = 2 * PI * 58 = 364.4

  useEffect(() => {
    // delay animation slightly for visual effect
    const timeout = setTimeout(() => {
      const circumference = 364.4;
      const calculatedOffset = circumference - (approvalRating / 100) * circumference;
      setOffset(calculatedOffset);
    }, 500);
    return () => clearTimeout(timeout);
  }, [approvalRating]);

  return (
    <div className="bg-[#0A0F1C] rounded-xl p-md text-white shadow-lg border border-[#16233B] transition-transform hover:-translate-y-1">
      <h3 className="font-headline-sm text-white italic mb-md">
        <span className="text-[#D4AF37]">FAN</span> METER
      </h3>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle 
              className="text-white/10" 
              cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"
            />
            <motion.circle 
              cx="64" cy="64" fill="transparent" r="58" 
              stroke="#D4AF37" 
              strokeWidth="8"
              strokeDasharray="364.4"
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ strokeLinecap: "round" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-headline-md text-3xl font-bold">{approvalRating}%</span>
            <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Approval</span>
          </div>
        </div>
        <div className="mt-md flex items-center gap-xs text-[#D4AF37]">
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
          <span className="font-label-sm">+4.2% THIS WEEK</span>
        </div>
      </div>
    </div>
  );
}
