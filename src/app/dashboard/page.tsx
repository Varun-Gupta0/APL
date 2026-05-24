"use client";

import { motion } from "framer-motion";
import { playerStats, recentMatches } from "@/lib/mockData";
import { Activity, Star, ChevronRight, MapPin, Zap } from "lucide-react";
import { PageTransition } from "@/components/shared/PageTransition";
import { usePlayerStore } from "@/store/playerStore";

export default function DashboardHome() {
  const nextMatch = recentMatches[0];
  const { 
    totalMatches = 0, 
    totalRuns = 0, 
    confidence = 78, 
    fitness = 92, 
    reputation = 85 
  } = usePlayerStore();

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Next Match Card - Hero Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative col-span-2 overflow-hidden rounded-xl border border-[#16233B] bg-[#101A2E] p-8 shadow-xl"
        >
          {/* Background Stadium Glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4A94D]/10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-heading text-xl tracking-wider text-white">UPCOMING FIXTURE</span>
              {nextMatch.isRivalry && (
                <span className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold tracking-widest text-red-500">
                  <Zap size={14} className="fill-red-500" />
                  RIVALRY MATCH
                </span>
              )}
            </div>

            <div className="mb-8 flex items-center gap-8">
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-blue-900/50 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <span className="font-heading text-2xl text-white">MI</span>
                </div>
                <span className="font-sans text-sm font-bold text-gray-300">INDIANS</span>
              </div>
              <div className="font-heading text-4xl text-gray-500">VS</div>
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-600/50 border border-yellow-500/30">
                  <span className="font-heading text-2xl text-white">CSK</span>
                </div>
                <span className="font-sans text-sm font-bold text-gray-300">KINGS</span>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={16} className="text-[#D4A94D]" />
              <span>Wankhede Stadium, Mumbai</span>
              <span className="mx-2">•</span>
              <span>Pitch: Flat / Batting Friendly</span>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4A94D] py-3 font-sans text-sm font-bold tracking-widest text-black shadow-[0_0_15px_rgba(212,169,77,0.3)] transition-all hover:bg-white">
              VIEW MATCH PREVIEW
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Career Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col justify-between rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-6 backdrop-blur-md"
        >
          <div>
            <h3 className="mb-6 font-heading text-xl tracking-wider text-white">CAREER OVERVIEW</h3>
            <div className="space-y-4">
              <StatRow label="Matches" value={(totalMatches ?? 0).toString()} />
              <StatRow label="Total Runs" value={(totalRuns ?? 0).toString()} />
              <StatRow label="Average" value={totalMatches > 0 ? ((totalRuns ?? 0) / totalMatches).toFixed(1) : "0.0"} highlight />
              <StatRow label="Strike Rate" value="142.5" />
              <StatRow label="Highest Score" value="76" />
            </div>
          </div>
          <div className="mt-6 border-t border-[#16233B] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-gray-500">FORM</span>
              <div className="flex gap-1">
                {/* Mock Form Graph */}
                {[40, 70, 30, 90, 100].map((h, i) => (
                  <div key={i} className="flex h-10 w-4 items-end rounded-sm bg-[#0B1220]">
                    <div
                      className={`w-full rounded-sm ${h > 50 ? "bg-[#D4A94D]" : "bg-gray-600"}`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid - Progression */}
      <div className="grid gap-6 md:grid-cols-3">
        <ProgressionCard title="MENTALITY" percentage={reputation ?? 85} color="#10B981" delay={0.2} />
        <ProgressionCard title="FITNESS" percentage={fitness ?? 92} color="#3B82F6" delay={0.3} />
        <ProgressionCard title="CONFIDENCE" percentage={confidence ?? 78} color="#D4A94D" delay={0.4} />
      </div>
      </div>
    </PageTransition>
  );
}

function StatRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-sans text-sm text-gray-400">{label}</span>
      <span className={`font-heading text-xl ${highlight ? "text-[#D4A94D]" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

function ProgressionCard({ title, percentage, color, delay }: { title: string; percentage: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-6 rounded-xl border border-[#16233B] bg-[#101A2E]/50 p-6 backdrop-blur-md"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#0B1220"
            strokeWidth="6"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray="175.9"
            initial={{ strokeDashoffset: 175.9 }}
            animate={{ strokeDashoffset: 175.9 - (175.9 * percentage) / 100 }}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <span className="font-heading text-lg text-white">{percentage}%</span>
      </div>
      <div>
        <h4 className="font-sans text-xs font-bold tracking-widest text-gray-400">{title}</h4>
        <div className="mt-1 font-heading text-xl text-white">OPTIMAL</div>
      </div>
    </motion.div>
  );
}
