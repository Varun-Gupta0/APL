"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { DollarSign, Star, Clock } from "lucide-react";

const sponsors = [
  { name: "Z-FUEL Energy", logo: "⚡", value: "₹45L/yr", status: "ACTIVE", type: "Energy Drink", color: "from-yellow-500/20", since: "Season 1" },
  { name: "VIPER Sports Gear", logo: "🏏", value: "₹30L/yr", status: "ACTIVE", type: "Equipment", color: "from-blue-500/20", since: "Season 1" },
  { name: "CricBuzz Media", logo: "📺", value: "₹20L/yr", status: "OFFER", type: "Media", color: "from-purple-500/20", since: "" },
  { name: "SkyBet Gaming", logo: "🎮", value: "₹15L/yr", status: "OFFER", type: "Gaming", color: "from-green-500/20", since: "" },
];

export default function SponsorsPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-8">
        <SectionHeader title="Sponsors & Endorsements" subtitle="Build your brand off the pitch" />

        {/* Total Earnings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#D4A94D]/30 bg-gradient-to-br from-[#D4A94D]/10 to-[#101A2E] p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-[#D4A94D] uppercase">Total Annual Earnings</p>
              <p className="font-heading text-5xl text-white mt-1">₹75 Lakhs</p>
              <p className="text-gray-400 mt-1">From 2 active sponsorships</p>
            </div>
            <DollarSign className="h-16 w-16 text-[#D4A94D]/40" />
          </div>
        </motion.div>

        {/* Sponsor Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {sponsors.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`rounded-xl border bg-gradient-to-br ${s.color} to-transparent p-6 cursor-pointer transition-all ${s.status === "ACTIVE" ? "border-[#D4A94D]/20" : "border-[#16233B]"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{s.logo}</div>
                  <div>
                    <p className="font-heading text-xl text-white">{s.name}</p>
                    <p className="text-sm text-gray-400">{s.type}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-[#D4A94D]/20 text-[#D4A94D]"}`}>{s.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-[#D4A94D]" />
                  <span className="font-heading text-2xl text-[#D4A94D]">{s.value}</span>
                </div>
                {s.status === "OFFER" ? (
                  <button className="rounded-lg bg-[#D4A94D] px-4 py-2 text-xs font-bold text-black uppercase tracking-wider hover:brightness-110 transition-all">Accept</button>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-gray-400"><Clock size={12} /> Since {s.since}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
