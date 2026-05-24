"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { usePlayerStore } from "@/store/playerStore";
import { ChevronRight, TrendingUp, Award, Calendar } from "lucide-react";

const timeline = [
  { season: "Season 1", team: "Mumbai Titans", matches: 14, runs: 687, avg: 49.1, status: "CURRENT" },
  { season: "Season 0", team: "U-23 Academy", matches: 8, runs: 312, avg: 39.0, status: "COMPLETED" },
];

export default function CareerPage() {
  const { name, role, specialty, teamName, ovr, level, fans } = usePlayerStore();

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeader title="My Career" subtitle={`${name} · ${role} · ${teamName}`} />

        {/* Career Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[#16233B] bg-gradient-to-br from-[#101A2E] to-[#0B1220] p-8"
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D4A94D]/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#D4A94D] shadow-[0_0_20px_rgba(212,169,77,0.3)]">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200" className="h-full w-full object-cover" alt={name} />
            </div>
            <div className="flex-1">
              <div className="mb-1 text-xs font-bold tracking-widest text-[#D4A94D] uppercase">Career Profile</div>
              <h2 className="font-heading text-4xl text-white uppercase">{name}</h2>
              <p className="text-gray-400">{role} · {specialty || "Specialist"} · {teamName}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {[role, specialty, "Season 1"].filter(Boolean).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#16233B] px-3 py-1 text-xs font-bold text-[#D4A94D] uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div><p className="font-heading text-3xl text-white">{ovr}</p><p className="text-xs text-gray-400">OVR</p></div>
              <div><p className="font-heading text-3xl text-[#D4A94D]">{level}</p><p className="text-xs text-gray-400">LEVEL</p></div>
            </div>
          </div>
        </motion.div>

        {/* Career Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Career Matches" value="22" delay={0.1} icon={<Calendar size={20} />} />
          <StatCard label="Total Runs" value="999" delay={0.2} icon={<TrendingUp size={20} />} />
          <StatCard label="Best Score" value="104*" accent delay={0.3} icon={<Award size={20} />} />
          <StatCard label="Followers" value={fans >= 1000 ? (fans/1000).toFixed(0)+"K" : fans.toString()} delay={0.4} />
        </div>

        {/* Career Timeline */}
        <div>
          <SectionHeader title="Season History" />
          <div className="space-y-3">
            {timeline.map((entry, i) => (
              <motion.div
                key={entry.season}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${entry.status === "CURRENT" ? "bg-[#D4A94D] shadow-[0_0_8px_rgba(212,169,77,0.6)]" : "bg-gray-600"}`} />
                  <div>
                    <p className="font-heading text-lg text-white">{entry.season}</p>
                    <p className="text-sm text-gray-400">{entry.team}</p>
                  </div>
                </div>
                <div className="hidden gap-8 text-center md:flex">
                  <div><p className="font-heading text-xl text-white">{entry.matches}</p><p className="text-xs text-gray-500">Matches</p></div>
                  <div><p className="font-heading text-xl text-white">{entry.runs}</p><p className="text-xs text-gray-500">Runs</p></div>
                  <div><p className="font-heading text-xl text-[#D4A94D]">{entry.avg}</p><p className="text-xs text-gray-500">Average</p></div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${entry.status === "CURRENT" ? "bg-[#D4A94D]/20 text-[#D4A94D]" : "bg-gray-700/50 text-gray-400"}`}>{entry.status}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
