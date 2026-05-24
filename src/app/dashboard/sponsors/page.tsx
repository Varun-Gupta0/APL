"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { DollarSign, Star, Clock, Check } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

interface LocalSponsor {
  id: string;
  name: string;
  logo: string;
  value: string;
  status: "ACTIVE" | "OFFER";
  type: string;
  color: string;
  since: string;
}

export default function SponsorsPage() {
  const { sponsorOffers, acceptSponsorOffer } = usePlayerStore();
  const [activeSponsors, setActiveSponsors] = useState<LocalSponsor[]>([
    { id: "s1", name: "Z-FUEL Energy", logo: "⚡", value: "₹45L/yr", status: "ACTIVE", type: "Energy Drink", color: "from-yellow-500/20", since: "Season 1" },
    { id: "s2", name: "VIPER Sports Gear", logo: "🏏", value: "₹30L/yr", status: "ACTIVE", type: "Equipment", color: "from-blue-500/20", since: "Season 1" },
  ]);

  const handleAcceptOffer = (offer: any) => {
    // Add to active list
    const newActive: LocalSponsor = {
      id: offer.id,
      name: offer.brand,
      logo: offer.logoEmoji || "🏷️",
      value: offer.offerValue,
      status: "ACTIVE",
      type: offer.category || "Endorsement",
      color: "from-[#D4A94D]/20",
      since: "Just Now",
    };
    setActiveSponsors((prev) => [...prev, newActive]);
    // Remove from store offers list
    acceptSponsorOffer(offer.id);
  };

  // Calculate total earnings (Lakhs)
  const calculateTotalEarnings = () => {
    let total = 0;
    activeSponsors.forEach((s) => {
      // Extract number from string like "₹45L/yr" or "₹30L deal"
      const match = s.value.match(/₹?(\d+)L?/);
      if (match && match[1]) {
        total += parseInt(match[1], 10);
      }
    });
    return total;
  };

  const totalLakhs = calculateTotalEarnings();

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
              <p className="font-heading text-5xl text-white mt-1">₹{totalLakhs} Lakhs</p>
              <p className="text-gray-400 mt-1">From {activeSponsors.length} active sponsorships</p>
            </div>
            <DollarSign className="h-16 w-16 text-[#D4A94D]/40" />
          </div>
        </motion.div>

        {/* Active Sponsors Section */}
        <div>
          <h3 className="mb-4 font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">Active Contracts</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {activeSponsors.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`rounded-xl border bg-gradient-to-br ${s.color} to-transparent p-6 border-[#D4A94D]/20`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{s.logo}</div>
                    <div>
                      <p className="font-heading text-xl text-white">{s.name}</p>
                      <p className="text-sm text-gray-400">{s.type}</p>
                    </div>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-bold bg-green-500/20 text-green-400 flex items-center gap-1">
                    <Check size={12} /> ACTIVE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-[#D4A94D]" />
                    <span className="font-heading text-2xl text-[#D4A94D]">{s.value}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400"><Clock size={12} /> Since {s.since}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Unlocked Offers Section */}
        <div>
          <h3 className="mb-4 font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">
            Sponsorship Offers ({sponsorOffers.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {sponsorOffers.length > 0 ? (
              sponsorOffers.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border bg-[#101A2E] p-6 border-[#16233B]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{offer.logoEmoji || "🏷️"}</div>
                      <div>
                        <p className="font-heading text-xl text-white">{offer.brand}</p>
                        <p className="text-sm text-gray-400 italic">“{offer.tagline}”</p>
                      </div>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-bold bg-[#D4A94D]/20 text-[#D4A94D]">OFFER</span>
                  </div>
                  
                  <div className="mb-4 p-3 rounded-lg bg-black/30 border border-white/5 text-xs text-gray-400">
                    <span className="font-bold text-[#D4A94D]">Requirement:</span> {offer.requirement}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-[#D4A94D]" />
                      <span className="font-heading text-2xl text-[#D4A94D]">{offer.offerValue}</span>
                    </div>
                    <button
                      onClick={() => handleAcceptOffer(offer)}
                      className="rounded-lg bg-[#D4A94D] px-6 py-2 text-xs font-bold text-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                    >
                      Sign Contract
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-gray-500 bg-[#111E32]/20 border border-[#16233B] rounded-xl">
                No active sponsor offers. Play high-drama matches and gain followers to unlock endorsements!
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
