"use client";

import { motion } from "framer-motion";
import { usePlayerStore, formatFans } from "@/store/playerStore";

export function TopHeader() {
  const { 
    name = "VIRAJ SHARMA", 
    ovr = 68, 
    level = 1, 
    fans = 12500, 
    xp = 0, 
    xpToNext = 100 
  } = usePlayerStore();
  const xpPct = (xpToNext || 100) > 0 ? Math.min(100, Math.max(0, ((xp || 0) / (xpToNext || 100)) * 100)) : 0;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#16233B] bg-[#0B1220]/90 backdrop-blur-md">
      <div className="flex h-20 items-center justify-between px-6 lg:pl-72">
        {/* Left Side — Brand */}
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-2xl tracking-wider text-white">
            ATHLETE//<span className="text-[#D4A94D]">ZERO</span>
          </h1>
        </div>

        {/* Right Side — Player Stats */}
        <div className="flex items-center gap-6">
          <div className="hidden text-right sm:block">
            <div className="font-heading text-lg tracking-wide text-white uppercase">{name}</div>
            <div className="text-xs font-bold tracking-widest text-[#D4A94D] uppercase">Rising Star</div>
          </div>

          <div className="flex gap-4 border-l border-[#16233B] pl-6">
            <StatBlock label="OVR" value={(ovr ?? 68).toString()} />
            <StatBlock label="LVL" value={(level ?? 1).toString()} />
            <StatBlock label="FANS" value={formatFans(fans ?? 12500)} />
          </div>

          {/* XP Progress bar */}
          <div className="hidden md:flex flex-col justify-center w-24">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-bold tracking-widest text-gray-500">XP</span>
              <span className="text-[9px] font-bold text-gray-500">{Math.round(xpPct)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#16233B]">
              <motion.div
                className="h-full rounded-full bg-[#D4A94D]"
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Avatar */}
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#D4A94D] shadow-[0_0_15px_rgba(212,169,77,0.3)] flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.05, 1], y: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-full"
            >
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop"
                alt={name}
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.1, 0.4, 0.1], x: [-20, 20, -20] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-[10px] font-bold tracking-widest text-gray-400">{label}</span>
      <span className="font-heading text-xl text-white">{value}</span>
    </div>
  );
}
