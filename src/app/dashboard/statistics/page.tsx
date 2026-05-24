"use client";

import { motion } from "framer-motion";
import { mediaVerdict } from "@/lib/mockData";
import { AudioVisualizer } from "@/components/ui/AudioVisualizer";
import { Target, Activity, MessageCircle } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";

export default function StatisticsDashboard() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionHeader title="Statistics" subtitle="Season 1 · Deep Performance Analytics" />
      {/* Top Narrative Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Media Verdict - Narrative Stat */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-2 flex flex-col justify-center rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-8 backdrop-blur-md"
        >
          <div className="mb-4 flex items-center gap-3 text-[#D4A94D]">
            <MessageCircle size={24} />
            <h3 className="font-heading text-2xl tracking-wider">{mediaVerdict.title}</h3>
          </div>
          <p className="font-sans text-xl leading-relaxed text-gray-300">
            "{mediaVerdict.text}"
          </p>
        </motion.div>

        {/* Crowd Hype Visualizer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-8 text-center backdrop-blur-md"
        >
          <h4 className="mb-6 font-sans text-xs font-bold tracking-widest text-gray-500">
            LIVE CROWD REACTION
          </h4>
          <AudioVisualizer />
          <div className="mt-4 font-heading text-2xl text-[#D4A94D]">HYPE: 88%</div>
        </motion.div>
      </div>

      {/* Deep Analytics Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strike Zone Analysis (Wagon Wheel Mock) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-[#16233B] bg-[#101A2E]/50 p-6 backdrop-blur-md"
        >
          <div className="mb-6 flex items-center gap-3">
            <Target className="text-[#D4A94D]" />
            <h3 className="font-heading text-xl tracking-wider text-white">STRIKE ZONE ANALYSIS</h3>
          </div>
          
          <div className="relative flex h-64 items-center justify-center rounded-lg bg-[#0B1220]">
            {/* Pitch Graphic Placeholder */}
            <div className="absolute h-full w-24 bg-[#16233B]/50 border-x border-gray-600/30" />
            
            {/* Neon Heatmap Blobs */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[20%] top-[30%] h-20 w-20 rounded-full bg-blue-500/40 blur-xl"
            />
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute left-[20%] bottom-[30%] h-32 w-32 rounded-full bg-[#D4A94D]/40 blur-2xl"
            />
            
            <div className="z-10 font-sans text-sm font-bold tracking-widest text-gray-500">
              [ 3D PITCH HEATMAP RENDER ]
            </div>
          </div>
        </motion.div>

        {/* Pressure Performance Mechanics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-[#16233B] bg-[#101A2E]/50 p-6 backdrop-blur-md"
        >
          <div className="mb-6 flex items-center gap-3">
            <Activity className="text-red-500" />
            <h3 className="font-heading text-xl tracking-wider text-white">PRESSURE PERFORMANCE</h3>
          </div>

          <div className="mb-4 space-y-2 text-sm text-gray-400">
            <p>Correlation between Match Tension and Batting Average.</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D4A94D]" />
              <span>Normal Conditions: Avg 52.4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span>High Tension (Heartbeat): Avg 28.1</span>
            </div>
          </div>

          {/* Line Graph Mock */}
          <div className="relative mt-8 h-40 w-full overflow-hidden border-b border-l border-[#16233B]">
            {/* Pulsing Red Line (High Tension) */}
            <svg className="absolute h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <motion.path
                d="M 0 50 Q 25 40 50 80 T 100 20"
                fill="none"
                stroke="url(#tensionGradient)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="tensionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4A94D" />
                  <stop offset="50%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#D4A94D" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Tension Overlay Glow */}
            <motion.div
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 mix-blend-overlay pointer-events-none"
            />
          </div>
        </motion.div>
      </div>
      </div>
    </PageTransition>
  );
}
