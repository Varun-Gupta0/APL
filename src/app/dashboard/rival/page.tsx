"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import Link from "next/link";
import { Zap, Shield, TrendingUp } from "lucide-react";
import { api, RivalProfile } from "@/lib/api";
import { usePlayerStore } from "@/store/playerStore";

export default function RivalPage() {
  const { currentRival } = usePlayerStore();
  const [rivals, setRivals] = useState<RivalProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRivals = async () => {
    setLoading(true);
    try {
      const data = await api.getRivals();
      if (data && data.length > 0) {
        setRivals(data);
      }
    } catch (err) {
      console.error("Failed to load rivals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRivals();
  }, []);

  const activeRival = rivals[0] || null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeader title="Rivals" subtitle="Your career rivalry defines your legacy" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#111E32]/40 rounded-xl border border-[#16233B]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D4A94D] border-t-transparent" />
            <p className="animate-pulse font-heading text-sm text-white uppercase tracking-wider">
              Scouting League Rivals...
            </p>
          </div>
        ) : activeRival ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/40 via-[#101A2E] to-[#0B1220] p-8"
          >
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-red-500/5 blur-3xl" />
            
            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <img 
                    src={activeRival.avatar || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200"} 
                    className="h-full w-full object-cover" 
                    alt={activeRival.name} 
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold tracking-widest text-red-400 uppercase">Primary Rival</div>
                  <h2 className="font-heading text-3xl text-white uppercase">{activeRival.name}</h2>
                  <p className="text-gray-400">{activeRival.role} · {activeRival.team} · OVR {activeRival.ovr}</p>
                </div>
              </div>
              
              <div className="flex flex-1 justify-around text-center border-t border-b border-white/5 py-4 md:py-0 md:border-none">
                <div>
                  <p className="font-heading text-3xl text-white">{activeRival.history.matchesPlayed}</p>
                  <p className="text-xs text-gray-400">Head-to-Head</p>
                </div>
                <div>
                  <p className="font-heading text-3xl text-[#D4A94D]">{activeRival.history.playerWins}</p>
                  <p className="text-xs text-gray-400">Your Wins</p>
                </div>
                <div>
                  <p className="font-heading text-3xl text-red-400">{activeRival.history.rivalWins}</p>
                  <p className="text-xs text-gray-400">Their Wins</p>
                </div>
              </div>
              
              <Link href="/dashboard/schedule">
                <button className="flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-bold tracking-widest text-white hover:bg-red-500 transition-colors uppercase">
                  <Zap size={16} className="fill-white" /> Challenge
                </button>
              </Link>
            </div>

            {/* Rivalry Dialogue Box (if exists) */}
            {activeRival.dialogue && (
              <div className="relative z-10 mt-6 p-4 rounded-lg bg-black/40 border border-red-500/20 text-sm italic text-gray-300">
                &ldquo;{activeRival.dialogue}&rdquo;
                <span className="block mt-1 text-right text-xs font-bold text-red-400 not-italic">— {activeRival.name}</span>
              </div>
            )}

            {/* Rivalry Progress */}
            <div className="relative z-10 mt-8 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                <span>Rivalry Tension</span>
                <span className="text-red-400 font-sans font-bold">{activeRival.tension}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#D4A94D] font-bold w-16">YOU {100 - activeRival.tension}%</span>
                <div className="flex-1 h-3 rounded-full bg-[#16233B] overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${100 - activeRival.tension}%` }} 
                    transition={{ duration: 1.5 }} 
                    className="h-full bg-[#D4A94D]" 
                  />
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${activeRival.tension}%` }} 
                    transition={{ duration: 1.5 }} 
                    className="h-full bg-red-500" 
                  />
                </div>
                <span className="text-sm text-red-400 font-bold w-16 text-right">{activeRival.tension}% THEM</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-8 text-center text-gray-400 bg-[#111E32]/20 border border-[#16233B] rounded-xl">
            No active rivals in your current career tier. Keep scoring to attract challengers!
          </div>
        )}

        {/* Rival Timeline */}
        {activeRival && (
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Shield, label: "Last Encounter", value: activeRival.history.lastMatchResult || "No match yet", color: "text-green-400" },
              { 
                icon: TrendingUp, 
                label: "Rivalry Intensity", 
                value: activeRival.tension > 75 ? "EXTREME" : activeRival.tension > 45 ? "HEATED" : "MODERATE", 
                color: activeRival.tension > 75 ? "text-red-400" : activeRival.tension > 45 ? "text-yellow-400" : "text-blue-400" 
              },
              { icon: Zap, label: "Next Match", value: "May 28 · Wankhede", color: "text-[#D4A94D]" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-5 flex items-center gap-4"
              >
                <item.icon className="h-8 w-8 text-[#D4A94D] flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 uppercase">{item.label}</p>
                  <p className={`font-heading text-lg ${item.color}`}>{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
