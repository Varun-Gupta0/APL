"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Dumbbell, Zap, Brain, Heart, Star, Check } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

const drills = [
  { name: "Power Hitting Nets", icon: Dumbbell, category: "BAT", xp: 120, duration: "45 min", difficulty: "Hard", color: "from-yellow-500/20 to-orange-500/10" },
  { name: "Speed Bowling Practice", icon: Zap, category: "BOWL", xp: 90, duration: "30 min", difficulty: "Medium", color: "from-blue-500/20 to-cyan-500/10" },
  { name: "Mental Conditioning", icon: Brain, category: "MENTAL", xp: 60, duration: "20 min", difficulty: "Easy", color: "from-purple-500/20 to-violet-500/10" },
  { name: "Stamina Circuit", icon: Heart, category: "FITNESS", xp: 80, duration: "40 min", difficulty: "Medium", color: "from-red-500/20 to-rose-500/10" },
];

export default function TrainingPage() {
  const { role, ovr, confidence, fitness, reputation, addXp } = usePlayerStore();
  const [trainingActive, setTrainingActive] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [trainedDrill, setTrainedDrill] = useState<any>(null);

  // Dynamic calculations based on player OVR and roles
  const batRating = role === "Batsman" ? ovr : role === "All-Rounder" ? Math.round(ovr * 0.9) : Math.round(ovr * 0.5);
  const bowlRating = role === "Bowler" ? ovr : role === "All-Rounder" ? Math.round(ovr * 0.9) : Math.round(ovr * 0.5);
  const fieldRating = 65;

  const attrs = [
    { label: "BAT", val: batRating, color: "#D4A94D" },
    { label: "BOWL", val: bowlRating, color: "#3B82F6" },
    { label: "FIELD", val: fieldRating, color: "#10B981" },
    { label: "CONFIDENCE", val: confidence, color: "#8B5CF6" },
    { label: "FITNESS", val: fitness, color: "#EF4444" },
  ];

  const handleStartDrill = (drill: any) => {
    if (trainingActive) return;
    setTrainingActive(drill.name);
    setTrainedDrill(drill);
    
    // Simulate drill completion after 2 seconds
    setTimeout(() => {
      addXp(drill.xp);
      
      // Update fitness and confidence values locally in store
      const store = usePlayerStore.getState();
      const updates: any = {};
      
      if (drill.category === "FITNESS") {
        updates.fitness = Math.min(100, store.fitness + 5);
      } else {
        updates.fitness = Math.max(30, store.fitness - 4); // Fatigue
      }
      
      if (drill.category === "MENTAL") {
        updates.confidence = Math.min(100, store.confidence + 6);
      } else {
        updates.confidence = Math.min(100, store.confidence + 2);
      }

      usePlayerStore.setState(updates);

      setTrainingActive(null);
      setShowDone(true);
      setTimeout(() => setShowDone(false), 2500);
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeader title="Training Ground" subtitle="Improve your attributes and unlock new abilities" />

        {/* Training Complete Animation Overlay */}
        <AnimatePresence>
          {showDone && trainedDrill && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 border border-green-400 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg max-w-md mx-auto"
            >
              <Check size={20} className="animate-bounce" />
              <span>Drill Complete! Gained +{trainedDrill.xp} XP and boosted attributes!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Drills */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Available Drills</h3>
            {drills.map((drill, i) => {
              const isActive = trainingActive === drill.name;
              return (
                <motion.div
                  key={drill.name}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={!trainingActive ? { x: 4 } : {}}
                  onClick={() => !trainingActive && handleStartDrill(drill)}
                  className={`flex items-center justify-between rounded-xl border p-5 transition-all ${
                    isActive 
                      ? "border-[#D4A94D] bg-[#16233B] shadow-[0_0_15px_rgba(212,169,77,0.2)] cursor-default" 
                      : trainingActive 
                      ? "border-[#16233B] bg-[#101A2E]/50 opacity-40 cursor-default" 
                      : `border-[#16233B] bg-gradient-to-r ${drill.color} bg-[#101A2E] cursor-pointer hover:border-[#D4A94D]/40`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#16233B]">
                      {isActive ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D4A94D] border-t-transparent" />
                      ) : (
                        <drill.icon className="h-6 w-6 text-[#D4A94D]" />
                      )}
                    </div>
                    <div>
                      <p className="font-heading text-lg text-white">{drill.name}</p>
                      <p className="text-sm text-gray-400">
                        {isActive ? "Training in progress..." : `${drill.duration} · ${drill.difficulty}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-xl text-[#D4A94D]">+{drill.xp} XP</p>
                    <span className="rounded-full bg-[#16233B] px-2 py-0.5 text-xs text-gray-400">{drill.category}</span>
                  </div>
                </motion.div>
              );
            })}
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
                    initial={{ width: 0 }} 
                    animate={{ width: `${a.val}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                </div>
              </div>
            ))}

            <p className="text-[11px] text-gray-500 font-sans leading-relaxed text-center italic">
              Drills consume stamina (FITNESS) but grant XP and confidence. Stamina circuits regenerate FITNESS.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
