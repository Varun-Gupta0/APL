"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Dumbbell, Zap, Brain, Heart } from "lucide-react";

const drills = [
  { name: "Power Hitting Nets", icon: Dumbbell, category: "BAT", xp: 120, duration: "45 min", difficulty: "Hard", color: "from-yellow-500/20 to-orange-500/10" },
  { name: "Speed Bowling Practice", icon: Zap, category: "BOWL", xp: 90, duration: "30 min", difficulty: "Medium", color: "from-blue-500/20 to-cyan-500/10" },
  { name: "Mental Conditioning", icon: Brain, category: "MENTAL", xp: 60, duration: "20 min", difficulty: "Easy", color: "from-purple-500/20 to-violet-500/10" },
  { name: "Stamina Circuit", icon: Heart, category: "FITNESS", xp: 80, duration: "40 min", difficulty: "Medium", color: "from-red-500/20 to-rose-500/10" },
];

const attrs = [
  { label: "BAT", val: 72, color: "#D4A94D" },
  { label: "BOWL", val: 45, color: "#3B82F6" },
  { label: "FIELD", val: 60, color: "#10B981" },
  { label: "MENTAL", val: 66, color: "#8B5CF6" },
  { label: "FITNESS", val: 70, color: "#EF4444" },
];

export default function TrainingPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeader title="Training Ground" subtitle="Improve your attributes and unlock new abilities" />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Drills */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Available Drills</h3>
            {drills.map((drill, i) => (
              <motion.div
                key={drill.name}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                className={`flex items-center justify-between rounded-xl border border-[#16233B] bg-gradient-to-r ${drill.color} bg-[#101A2E] p-5 cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#16233B]">
                    <drill.icon className="h-6 w-6 text-[#D4A94D]" />
                  </div>
                  <div>
                    <p className="font-heading text-lg text-white">{drill.name}</p>
                    <p className="text-sm text-gray-400">{drill.duration} · {drill.difficulty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-xl text-[#D4A94D]">+{drill.xp} XP</p>
                  <span className="rounded-full bg-[#16233B] px-2 py-0.5 text-xs text-gray-400">{drill.category}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Attributes Panel */}
          <div className="rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-6 space-y-6">
            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Current Attributes</h3>
            {attrs.map((a, i) => (
              <div key={a.label}>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-sm font-bold text-white">{a.label}</span>
                  <span className="text-sm font-bold" style={{ color: a.color }}>{a.val}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#16233B]">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${a.val}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                </div>
              </div>
            ))}

            <button className="w-full rounded-lg bg-[#D4A94D] py-3 text-sm font-bold tracking-widest text-black hover:brightness-110 active:scale-95 transition-all uppercase">
              Start Training Session
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
