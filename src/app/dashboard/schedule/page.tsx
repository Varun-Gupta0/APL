"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MapPin, Zap } from "lucide-react";
import Link from "next/link";

const matches = [
  { date: "May 28", opponent: "Delhi Dynamos", venue: "Wankhede Stadium", time: "7:30 PM", isRivalry: true, importance: "HIGH" },
  { date: "Jun 3", opponent: "Kolkata Knights", venue: "Eden Gardens", time: "7:30 PM", isRivalry: false, importance: "MED" },
  { date: "Jun 10", opponent: "Bangalore Royals", venue: "Chinnaswamy Stadium", time: "4:00 PM", isRivalry: false, importance: "HIGH" },
  { date: "Jun 17", opponent: "Chennai Kings", venue: "Chepauk", time: "7:30 PM", isRivalry: false, importance: "LOW" },
  { date: "Jun 24", opponent: "Punjab Lions", venue: "PCA Stadium", time: "7:30 PM", isRivalry: false, importance: "MED" },
];

export default function SchedulePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeader title="Match Schedule" subtitle="Season 1 · Mumbai Titans" />

        {/* Next Match Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-900/20 via-[#101A2E] to-[#0B1220] p-8"
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <Zap size={14} className="fill-red-500 text-red-500" />
              <span className="text-xs font-bold tracking-widest text-red-500 uppercase">Rivalry Match · Next Up</span>
            </div>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="mb-2 h-16 w-16 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center">
                    <span className="font-heading text-xl text-white">MI</span>
                  </div>
                  <span className="text-sm text-gray-300">TITANS</span>
                </div>
                <span className="font-heading text-3xl text-gray-600">VS</span>
                <div className="text-center">
                  <div className="mb-2 h-16 w-16 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center">
                    <span className="font-heading text-xl text-white">DD</span>
                  </div>
                  <span className="text-sm text-gray-300">DYNAMOS</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400"><MapPin size={14} className="text-[#D4A94D]" /> Wankhede Stadium, Mumbai</div>
                <p className="text-xl text-white font-bold">May 28 · 7:30 PM</p>
              </div>
              <Link href="/dashboard/match">
                <button className="rounded-lg bg-[#D4A94D] px-8 py-3 font-bold tracking-widest text-black uppercase hover:brightness-110 active:scale-95 transition-all">
                  Play Match
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Fixtures */}
        <div>
          <SectionHeader title="Upcoming Fixtures" />
          <div className="space-y-3">
            {matches.slice(1).map((match, i) => (
              <motion.div
                key={match.date}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-5"
              >
                <div className="w-20 text-center">
                  <p className="font-heading text-lg text-[#D4A94D]">{match.date.split(" ")[1]}</p>
                  <p className="text-xs text-gray-500">{match.date.split(" ")[0]}</p>
                </div>
                <div className="flex-1 ml-4">
                  <p className="font-heading text-lg text-white">vs {match.opponent}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-400"><MapPin size={12} /> {match.venue}</div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{match.time}</p>
                  <span className={`text-xs font-bold ${match.importance === "HIGH" ? "text-[#D4A94D]" : match.importance === "MED" ? "text-blue-400" : "text-gray-500"}`}>{match.importance}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
