"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/playerStore";
import { PageTransition } from "@/components/shared/PageTransition";
import { ChevronRight, Shield, User } from "lucide-react";

const TEAMS = [
  {
    id: "titans",
    name: "Titans",
    fullName: "MUMBAI TITANS",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbm2f4935s4dVVgAjn22zQ-Phf2Mjs4R4RJglCbfdU5g0mjqtx3a4G5RRnUkkIR8lkVksY4AS92WM2JcZyl3jLx-jttmuINw2T7Q7CkqmekxdCJXiykmAp_cqmRkhALNqXVlpcjhefpdFpQIw066QpDFT6tSj8W0TZWf78Y6i1EcfMaUE-KHMUqd-sOofGQsiwGqJM85irBA-ekj3R3vFfCHpCWecJO3jZzeZU4d1k0aO0uNvmB9kFFsuw8kEx5yjhw4euA4_YoII",
    bgImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1920&auto=format&fit=crop",
    offense: 94,
    defense: 88,
    budget: 72,
    tier: "Pro League Tier 1",
    rank: "#04",
    prospects: [
      { name: "Ishaan Sharma", role: "Captain / All-Rounder", rating: 91 },
      { name: "David Miller", role: "Power Hitter", rating: 87 }
    ]
  },
  {
    id: "dynamos",
    name: "Dynamos",
    fullName: "DELHI DYNAMOS",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZQHjDW3JUcYDENFv0uleeebcJcAIy4WPvBTw1BORm2S1g7DVNC49bnjs1XZDjFIPhf75VR3s5yWX-hJGGSNkggI5D2YwMf0cJYM2IIG-HpWO7TUD-a25tFL5VgTisyxZ0hoUrGmsxq1Ll1SLx50BfO8KV7q7BcOQaMYwVEYa7cJbaxpIUGzRJq-uUrxGjvGuU57vkNFH1FY9113RvQKVjVp6Jz-Fbo510AEwReJcFH-33b5ktCkJXihssefucjan95bopZnxwxNE",
    bgImage: "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?q=80&w=1920&auto=format&fit=crop",
    offense: 86,
    defense: 92,
    budget: 85,
    tier: "Pro League Tier 1",
    rank: "#02",
    prospects: [
      { name: "Virat Kohli", role: "Opening Batsman", rating: 95 },
      { name: "Axar Patel", role: "Spin Bowler", rating: 89 }
    ]
  },
  {
    id: "royals",
    name: "Royals",
    fullName: "BANGALORE ROYALS",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtKIaTfFBDgv1Xrbzn_QwXs1cUnB5w89rJuw5j_hy2xPsnhdzZZv2lbDPJADjLka-4X_5ep8FzbdTcasKf3WAdqAzfKThIdoBqp2TQkDRstcDMGGUPQFF1Aq2tiun1xA1XLoBs01K5OfS5XGIaZzfReoCg-JtsmCvB4UjaaRW94PTpegZ0BGMQjLKamo2dCTbR3mE1ydHHG2OHgyYoNM4dixSAONmvmEc-I-uQccQmxt8mBRpz6pI52Bk373JBAm6UJx5ypQrSggc",
    bgImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1920&auto=format&fit=crop",
    offense: 98,
    defense: 82,
    budget: 90,
    tier: "Pro League Tier 1",
    rank: "#01",
    prospects: [
      { name: "AB de Villiers", role: "Finisher", rating: 94 },
      { name: "Glenn Maxwell", role: "All-Rounder", rating: 90 }
    ]
  },
  {
    id: "kings",
    name: "Kings",
    fullName: "CHENNAI KINGS",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb6Y2RiMJz8bjn5ufTi8g2wcSHUwMl9-REdfvvOGnCIdDEKpP5luR2Q2NjPs87v-_eHALwRys8KBq4z_f1PIvraWjWiME1dAHeOoqq9LlpW_qVnCaxtzyM6-570MdUQTZSSPl9SFJ0WNDgr6LZjyovJDUs1Y3aICrc6UZDPUygfKVjJosN0nSSDrYkIotcA7R5rfYC2zqwfG-tcx6n7pVNqqpv5Swh-0K1ZcJs0k2a4AxuvWLlhhRkrIRf9DA53GfKR2GGrrlzeLg",
    bgImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1920&auto=format&fit=crop",
    offense: 88,
    defense: 95,
    budget: 80,
    tier: "Pro League Tier 1",
    rank: "#03",
    prospects: [
      { name: "MS Dhoni", role: "Wicketkeeper / Captain", rating: 93 },
      { name: "Ravindra Jadeja", role: "All-Rounder", rating: 91 }
    ]
  },
  {
    id: "knights",
    name: "Knights",
    fullName: "KOLKATA KNIGHTS",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzoSlZe7oijqaZNDFqZuU1h-GDNA9lz3OHFSuz0tfIfeNMu5H62QfseVPNYuutsZMz4hwShHJDtuCFm2EEtNJPoxvderqdjJVpy3Jw_Ios2kO_3PiTATpL79lS6AzmYgJp1yw0bhQH2BRMWywmVOPTyQAhWt7wyW1kzUEOPEe5rvwiGLrWjiIIKEhuQ1OJcKiQDyAuNsQlrODofmOB6ZHcfF48-Ek08pLl6RnEdAiZ9cJoGk1lO8mqcQM9Vw_wOuABOFyR4_4yfx4",
    bgImage: "https://images.unsplash.com/photo-1624880357913-a8539238165b?q=80&w=1920&auto=format&fit=crop",
    offense: 90,
    defense: 90,
    budget: 88,
    tier: "Pro League Tier 1",
    rank: "#05",
    prospects: [
      { name: "Andre Russell", role: "Power Hitter", rating: 92 },
      { name: "Sunil Narine", role: "Mystery Spinner", rating: 89 }
    ]
  }
];

export default function TeamSelectPage() {
  const router = useRouter();
  const setTeam = usePlayerStore((s) => s.setTeam);
  const isCreated = usePlayerStore((s) => s.isCreated);
  const teamSelected = usePlayerStore((s) => s.teamSelected);
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0].id);
  const [hydrated, setHydrated] = useState(false);

  const selectedTeam = TEAMS.find(t => t.id === selectedTeamId) || TEAMS[0];

  useEffect(() => {
    if (usePlayerStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = usePlayerStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (hydrated && !isCreated) {
      router.replace("/create-player");
    }
  }, [hydrated, isCreated, router]);

  const handleConfirm = () => {
    setTeam(selectedTeam.fullName);
    router.push("/dashboard/home");
  };

  if (!hydrated || !isCreated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1220]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4A94D] border-t-transparent" />
          <p className="animate-pulse font-heading text-lg tracking-wider text-white uppercase">
            LOADING ONBOARDING...
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-[#0B1220] font-sans">
        {/* Onboarding Header */}
        <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-[#16233B] bg-[#0B1220]/90 px-8 py-6 backdrop-blur-md">
          <h1 className="font-heading text-2xl tracking-wider text-white uppercase">
            ATHLETE//<span className="text-[#D4A94D]">ZERO</span>
          </h1>
          <div className="font-sans text-xs font-bold tracking-widest text-gray-500 uppercase">
            STEP 2: FRANCHISE SELECTION
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center px-4 pt-28 pb-32 md:px-8 xl:px-16">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-12">
            
            {/* Hero Profile Section */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTeam.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-2xl border border-[#16233B] bg-[#101A2E] shadow-[0_0_30px_rgba(212,169,77,0.1)]"
                >
                  <div className="absolute inset-0">
                    <img
                      src={selectedTeam.bgImage}
                      alt="Stadium"
                      className="h-full w-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-transparent to-transparent" />
                  </div>

                  <div className="relative z-10 flex flex-col justify-end p-8 md:p-12 lg:min-h-[450px]">
                    <div className="mb-4 inline-block rounded-md border border-[#D4A94D]/30 bg-[#D4A94D]/10 px-3 py-1 font-sans text-xs font-bold tracking-widest text-[#D4A94D] uppercase">
                      {selectedTeam.tier}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                      <div>
                        <h2 className="mb-2 font-heading text-5xl tracking-wide text-white md:text-7xl">
                          {selectedTeam.fullName}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Shield size={16} />
                          <span className="font-sans text-sm font-bold tracking-widest uppercase">
                            Global Rank: {selectedTeam.rank}
                          </span>
                        </div>
                      </div>
                      <img
                        src={selectedTeam.logo}
                        alt="Logo"
                        className="h-24 w-24 object-contain opacity-90 mix-blend-screen md:h-32 md:w-32"
                      />
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-10 grid grid-cols-3 gap-6 rounded-xl border border-[#16233B] bg-[#101A2E]/60 p-6 backdrop-blur-md">
                      <StatProgressBar label="OFFENSE" value={selectedTeam.offense} />
                      <StatProgressBar label="DEFENSE" value={selectedTeam.defense} />
                      <StatProgressBar label="BUDGET" value={selectedTeam.budget} />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Elite Prospects Sidebar */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              <div className="flex-1 rounded-2xl border border-[#16233B] bg-[#101A2E]/80 p-8 backdrop-blur-md">
                <h3 className="mb-6 font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Elite Prospects
                </h3>
                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {selectedTeam.prospects.map((prospect, i) => (
                      <motion.div
                        key={`${selectedTeam.id}-${i}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                        className={`flex items-center gap-4 rounded-xl border p-4 ${
                          i === 0
                            ? "border-[#D4A94D]/30 bg-[#D4A94D]/5"
                            : "border-[#16233B] bg-[#0B1220]"
                        }`}
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${i === 0 ? "border-[#D4A94D]/50 text-[#D4A94D]" : "border-[#16233B] text-gray-500"}`}>
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-heading text-xl text-white">{prospect.name}</p>
                          <p className="font-sans text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                            {prospect.role}
                          </p>
                        </div>
                        <div className={`font-heading text-2xl ${i === 0 ? "text-[#D4A94D]" : "text-white"}`}>
                          {prospect.rating}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Confirm CTA */}
              <motion.button
                onClick={handleConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#D4A94D] py-5 font-sans text-sm font-bold tracking-widest text-black shadow-[0_0_20px_rgba(212,169,77,0.3)] transition-all hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] uppercase"
              >
                SIGN CONTRACT
                <ChevronRight className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </main>

        {/* Bottom Carousel Navigation */}
        <div className="fixed bottom-0 z-40 w-full border-t border-[#16233B] bg-[#0B1220]/95 px-4 py-6 backdrop-blur-md md:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto pb-2 scrollbar-custom">
            {TEAMS.map((team) => {
              const isActive = team.id === selectedTeamId;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`group relative flex min-w-[240px] items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-[#D4A94D] bg-[#16233B] shadow-[0_0_15px_rgba(212,169,77,0.2)]"
                      : "border-[#16233B] bg-[#101A2E] hover:border-gray-500"
                  }`}
                >
                  <img
                    src={team.logo}
                    alt={team.name}
                    className={`h-12 w-12 object-contain transition-all ${!isActive && "opacity-50 grayscale group-hover:grayscale-0"}`}
                  />
                  <div>
                    <p className={`font-heading text-xl uppercase ${isActive ? "text-white" : "text-gray-400"}`}>
                      {team.name}
                    </p>
                    <p className="font-sans text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                      Select Franchise
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function StatProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between font-sans text-[10px] font-bold tracking-widest uppercase">
        <span className="text-gray-400">{label}</span>
        <span className="text-[#D4A94D]">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#0B1220]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-[#D4A94D] shadow-[0_0_8px_rgba(212,169,77,0.5)]"
        />
      </div>
    </div>
  );
}
