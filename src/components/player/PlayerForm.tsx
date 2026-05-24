"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleSelector } from "./RoleSelector";
import { PersonalitySelector } from "./PersonalitySelector";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface PlayerData {
  name: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  personality: string;
  specialty: string;
}

interface PlayerFormProps {
  playerData: PlayerData;
  setPlayerData: (data: PlayerData) => void;
}

export function PlayerForm({ playerData, setPlayerData }: PlayerFormProps) {
  const updateField = (field: keyof PlayerData, value: string) => {
    setPlayerData({ ...playerData, [field]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col h-full bg-[#F3F4F6] rounded-3xl overflow-hidden"
    >
      {/* Header Area */}
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">CREATE YOUR CRICKETER</h1>
        <p className="text-[15px] text-slate-500 mt-1">Your journey begins now</p>
      </div>

      {/* Form Fields */}
      <div className="px-8 pb-8 pt-2 flex flex-col gap-5 flex-grow">
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Player Name</Label>
          <div className="relative">
            <Input 
              value={playerData.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="bg-white border-slate-200 text-slate-900 h-11 rounded-xl pl-4 pr-10 focus-visible:ring-slate-300 shadow-sm"
              placeholder="Enter name"
            />
            {playerData.name && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
        </div>

        <RoleSelector 
          value={playerData.role} 
          onChange={(val) => updateField("role", val)} 
        />

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Batting Style</Label>
          <Select value={playerData.battingStyle} onValueChange={(val) => updateField("battingStyle", val || "")}>
            <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 h-11 rounded-xl shadow-sm">
              <SelectValue placeholder="Select Batting Style" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-xl">
              <SelectItem value="Right Handed">Right Handed</SelectItem>
              <SelectItem value="Left Handed">Left Handed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Bowling Style</Label>
          <Select value={playerData.bowlingStyle} onValueChange={(val) => updateField("bowlingStyle", val || "")}>
            <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 h-11 rounded-xl shadow-sm">
              <SelectValue placeholder="Select Bowling Style" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-xl">
              <SelectItem value="Right Arm Medium">Right Arm Medium</SelectItem>
              <SelectItem value="Right Arm Fast">Right Arm Fast</SelectItem>
              <SelectItem value="Off Spin">Off Spin</SelectItem>
              <SelectItem value="Leg Spin">Leg Spin</SelectItem>
              <SelectItem value="Left Arm Fast">Left Arm Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <PersonalitySelector 
          value={playerData.personality} 
          onChange={(val) => updateField("personality", val)} 
        />

        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Speciality</Label>
          <Select value={playerData.specialty} onValueChange={(val) => updateField("specialty", val || "")}>
            <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 h-11 rounded-xl shadow-sm">
              <SelectValue placeholder="Select Speciality" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-xl">
              <SelectItem value="Finisher">Finisher</SelectItem>
              <SelectItem value="Anchor">Anchor</SelectItem>
              <SelectItem value="Power Hitter">Power Hitter</SelectItem>
              <SelectItem value="Strike Bowler">Strike Bowler</SelectItem>
              <SelectItem value="Economical">Economical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          <Button className="w-full h-12 bg-[#D4A94D] hover:bg-[#C39A3C] text-slate-900 font-bold tracking-wide text-[15px] rounded-xl shadow-[0_4px_14px_rgba(212,169,77,0.4)] transition-all">
            CREATE PLAYER
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
