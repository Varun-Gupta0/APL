"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  accent?: boolean;
  delay?: number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, subLabel, accent = false, delay = 0, icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-5 backdrop-blur-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">{label}</p>
          <p className={`mt-1 font-heading text-3xl font-bold ${accent ? "text-[#D4A94D]" : "text-white"}`}>
            {value}
          </p>
          {subLabel && <p className="mt-1 text-xs text-gray-500">{subLabel}</p>}
        </div>
        {icon && <div className="text-[#D4A94D]">{icon}</div>}
      </div>
    </motion.div>
  );
}
