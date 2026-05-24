"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Trophy, Lock } from "lucide-react";

const achievements = [
  { name: "First Fifty", desc: "Score 50+ runs in a match", icon: "🏏", unlocked: true },
  { name: "First Century", desc: "Score 100+ runs in a match", icon: "💯", unlocked: true },
  { name: "Rising Star", desc: "Reach 100K fans", icon: "⭐", unlocked: true },
  { name: "Viral Moment", desc: "Get featured in social feed", icon: "📱", unlocked: true },
  { name: "Rival Crusher", desc: "Win 3 rivalry matches in a row", icon: "⚔️", unlocked: false },
  { name: "Season Legend", desc: "Finish top 3 in batting charts", icon: "🏆", unlocked: false },
  { name: "Brand Icon", desc: "Sign 3 sponsorships", icon: "💎", unlocked: false },
  { name: "Global Superstar", desc: "Reach 1M fans", icon: "🌍", unlocked: false },
];

export default function AchievementsPage() {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeader title="Achievements" subtitle={`${unlocked} / ${achievements.length} Unlocked`} />

        {/* Progress Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#D4A94D]/30 bg-gradient-to-br from-[#D4A94D]/10 to-[#101A2E] p-6 flex items-center gap-6"
        >
          <Trophy className="h-16 w-16 text-[#D4A94D] flex-shrink-0" />
          <div className="flex-1">
            <p className="font-heading text-3xl text-white">{unlocked} Achievements</p>
            <div className="mt-2 h-2 w-full rounded-full bg-[#16233B]">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${(unlocked / achievements.length) * 100}%` }}
                transition={{ duration: 1.5 }}
                className="h-full rounded-full bg-[#D4A94D]"
              />
            </div>
            <p className="mt-1 text-sm text-gray-400">{achievements.length - unlocked} remaining</p>
          </div>
        </motion.div>

        {/* Achievement Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.name}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-xl border p-5 text-center transition-all cursor-default ${ach.unlocked ? "border-[#D4A94D]/30 bg-gradient-to-b from-[#D4A94D]/10 to-[#101A2E]" : "border-[#16233B] bg-[#0B1220] opacity-50"}`}
            >
              {!ach.unlocked && <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-600" />}
              <div className="text-4xl mb-3">{ach.icon}</div>
              <p className={`font-heading text-lg ${ach.unlocked ? "text-white" : "text-gray-500"}`}>{ach.name}</p>
              <p className="text-xs text-gray-500 mt-1">{ach.desc}</p>
              {ach.unlocked && (
                <div className="mt-3 inline-block rounded-full bg-[#D4A94D]/20 px-2 py-0.5 text-[10px] font-bold text-[#D4A94D] uppercase tracking-wider">Unlocked</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
