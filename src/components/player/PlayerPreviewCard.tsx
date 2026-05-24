import { motion } from "framer-motion";
import { StatBars } from "./StatBars";
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";

interface PlayerPreviewCardProps {
  playerData: {
    name: string;
    role: string;
    battingStyle: string;
    bowlingStyle: string;
    personality: string;
    specialty: string;
  };
}

export function PlayerPreviewCard({ playerData }: PlayerPreviewCardProps) {
  const getOvr = () => {
    return 68; // Based on the reference
  };

  const stats = {
    bat: 72,
    bowl: 45,
    field: 60,
    mental: 66,
    fitness: 70
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-full min-h-[600px] flex"
    >
      <Card className="relative overflow-hidden w-full h-full rounded-[2rem] border border-white/10 shadow-2xl bg-card">
        {/* Background / Portrait Image */}
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url('/player_portrait.png')" }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Top Right Corner - Rating & Role */}
        <div className="absolute top-6 right-6 flex flex-col items-end z-10 gap-1">
          <Pencil className="w-4 h-4 text-white/50 hover:text-white cursor-pointer transition-colors" />
          <div className="flex flex-col items-center mt-4">
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">OVR</span>
            <span className="text-4xl font-black text-white leading-none mt-1">{getOvr()}</span>
            <span className="text-[10px] font-bold text-white tracking-widest uppercase mt-2">BAT</span>
          </div>
        </div>

        {/* Content Container (Bottom Aligned) */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col">
          {/* Player Info */}
          <div className="px-6 flex flex-col items-center text-center pb-8">
            <motion.h2 
              key={playerData.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[28px] font-black text-white uppercase tracking-wider"
            >
              {playerData.name || "PLAYER NAME"}
            </motion.h2>
            <motion.span 
              key={playerData.specialty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground font-bold tracking-[0.2em] uppercase mt-1"
            >
              THE {playerData.specialty || "UNKNOWN"}
            </motion.span>
          </div>

          {/* Stats Bar */}
          <StatBars stats={stats} />

          {/* Footer Quote */}
          <div className="px-8 py-8 border-t border-white/5 flex flex-col items-center justify-center relative">
            <p className="text-sm text-muted-foreground/80 font-medium tracking-wide text-center max-w-xs">
              "Talent gets you noticed.<br/>Attitude makes you unforgettable."
            </p>
            <p className="text-primary/70 font-mono italic mt-4 self-end text-sm pr-6">
              - Coach
            </p>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-white/20" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
