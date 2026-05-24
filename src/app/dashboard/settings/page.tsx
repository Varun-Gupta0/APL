"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { usePlayerStore } from "@/store/playerStore";
import { Settings, Bell, Volume2, Monitor, Shield } from "lucide-react";

function ToggleRow({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#16233B]">
      <span className="text-gray-300">{label}</span>
      <div className={`relative h-6 w-12 rounded-full cursor-pointer transition-colors ${defaultOn ? "bg-[#D4A94D]" : "bg-[#16233B]"}`}>
        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${defaultOn ? "left-7" : "left-1"}`} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { name, role, teamName } = usePlayerStore();

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl space-y-8">
        <SectionHeader title="Settings" subtitle="Customize your career simulator experience" />

        {/* Player Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-[#D4A94D] h-5 w-5" />
            <h3 className="font-heading text-lg text-white">Career Profile</h3>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Player Name</label>
              <input defaultValue={name} className="rounded-lg bg-[#16233B] border border-[#1E293B] p-3 text-white outline-none focus:ring-2 focus:ring-[#D4A94D] transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Role</label>
                <input defaultValue={role} className="rounded-lg bg-[#16233B] border border-[#1E293B] p-3 text-white outline-none focus:ring-2 focus:ring-[#D4A94D] transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Team</label>
                <input defaultValue={teamName} className="rounded-lg bg-[#16233B] border border-[#1E293B] p-3 text-white outline-none focus:ring-2 focus:ring-[#D4A94D] transition-all" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-[#D4A94D] h-5 w-5" />
            <h3 className="font-heading text-lg text-white">Notifications</h3>
          </div>
          <ToggleRow label="Match reminders" defaultOn={true} />
          <ToggleRow label="Social feed alerts" defaultOn={true} />
          <ToggleRow label="Rival activity" defaultOn={true} />
          <ToggleRow label="Sponsorship offers" defaultOn={false} />
        </motion.div>

        {/* Audio/Visual */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="text-[#D4A94D] h-5 w-5" />
            <h3 className="font-heading text-lg text-white">Audio & Visuals</h3>
          </div>
          <ToggleRow label="Ambient sound effects" defaultOn={true} />
          <ToggleRow label="Cinematic transitions" defaultOn={true} />
          <ToggleRow label="Reduce motion" defaultOn={false} />
        </motion.div>

        <button className="w-full rounded-lg bg-[#D4A94D] py-3 font-bold tracking-widest text-black uppercase hover:brightness-110 active:scale-95 transition-all">
          Save Changes
        </button>
      </div>
    </PageTransition>
  );
}
