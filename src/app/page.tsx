"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Activity, Users } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

export default function LandingPage() {
  const { isCreated, teamSelected, reset } = usePlayerStore();
  const [hydrated, setHydrated] = useState(false);

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

  const startPath = "/create-player";

  // Login goes to dashboard if created, otherwise onboarding
  const loginPath = hydrated
    ? isCreated && teamSelected
      ? "/dashboard/home"
      : !isCreated
      ? "/create-player"
      : "/team-select"
    : "/dashboard/home";

  return (
    <div className="relative min-h-screen bg-[#0B1220] overflow-hidden">
      {/* Background with Ken Burns Effect */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1920&auto=format&fit=crop"
          alt="Stadium"
          className="h-full w-full object-cover opacity-20"
        ></img>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/80 to-transparent" />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4A94D]/10 via-transparent to-transparent opacity-50" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <h1 className="font-heading text-3xl tracking-wider text-white">
          ATHLETE//<span className="text-[#D4A94D]">ZERO</span>
        </h1>
        <div className="flex gap-4">
          <Link
            href={loginPath}
            className="rounded-sm bg-[#16233B] px-6 py-2 font-sans text-sm font-bold tracking-widest text-white transition-colors hover:bg-[#16233B]/80"
          >
            LOGIN
          </Link>
          <Link
            href={startPath}
            className="rounded-sm bg-[#D4A94D] px-6 py-2 font-sans text-sm font-bold tracking-widest text-black shadow-[0_0_15px_rgba(212,169,77,0.4)] transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
          >
            START CAREER
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h2 className="mb-6 font-heading text-6xl tracking-tight text-white md:text-8xl">
            LIVE THE RISE OF A <br />
            <span className="text-[#D4A94D]">CRICKET SUPERSTAR</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl font-sans text-lg text-gray-400">
            ATHLETE//ZERO is an AI-powered cricket career simulator that combines cinematic storytelling, social media drama, rivalries, and gamified progression.
          </p>
          <Link
            href={startPath}
            className="inline-block rounded-sm bg-[#D4A94D] px-10 py-4 font-sans text-lg font-bold tracking-widest text-black shadow-[0_0_20px_rgba(212,169,77,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,169,77,0.6)]"
          >
            START YOUR JOURNEY
          </Link>
        </motion.div>
      </main>

      {/* Modular Feature Cards */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        <FeatureCard
          icon={Activity}
          title="DYNAMIC RIVALRIES"
          desc="Face off against AI-driven rivals. Tension impacts your real-time match stats."
        />
        <FeatureCard
          icon={Users}
          title="SOCIAL ECOSYSTEM"
          desc="Watch the world react. Verified analysts, fan hype, and media headlines."
        />
        <FeatureCard
          icon={Trophy}
          title="LEGACY PROGRESSION"
          desc="Rise from a Local Hero to a Global Icon. Fill your cinematic trophy cabinet."
        />
      </section>

      {/* Scrolling Ticker */}
      <div className="absolute bottom-0 w-full overflow-hidden border-t border-[#16233B] bg-[#101A2E] py-2">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap font-sans text-sm font-bold tracking-widest text-gray-400"
        >
          <span className="mx-8">🔥 BREAKING: VIRAJ SHARMA SIGNS MEGA DEAL WITH Z-FUEL</span>
          <span className="mx-8 text-[#D4A94D]">|</span>
          <span className="mx-8">🏆 IPL 2024 FINALS TICKETS SOLD OUT</span>
          <span className="mx-8 text-[#D4A94D]">|</span>
          <span className="mx-8">🏏 ARJUN PATEL CALLS OUT VIRAJ IN PRESS CONFERENCE</span>
          <span className="mx-8 text-[#D4A94D]">|</span>
          {/* Duplicate for seamless loop */}
          <span className="mx-8">🔥 BREAKING: VIRAJ SHARMA SIGNS MEGA DEAL WITH Z-FUEL</span>
          <span className="mx-8 text-[#D4A94D]">|</span>
          <span className="mx-8">🏆 IPL 2024 FINALS TICKETS SOLD OUT</span>
          <span className="mx-8 text-[#D4A94D]">|</span>
          <span className="mx-8">🏏 ARJUN PATEL CALLS OUT VIRAJ IN PRESS CONFERENCE</span>
        </motion.div>
      </div>
      {/* Dev Reset */}
      <button
        onClick={reset}
        className="absolute bottom-4 right-4 z-50 font-sans text-xs font-bold tracking-widest text-gray-600 uppercase transition-colors hover:text-white"
      >
        [DEV] RESET PROGRESS
      </button>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group cursor-pointer rounded-lg border border-[#16233B] bg-[#101A2E]/80 p-6 backdrop-blur-md transition-colors hover:border-[#D4A94D]/50"
    >
      <div className="mb-4 inline-flex rounded-full bg-[#16233B] p-3 text-[#D4A94D] transition-colors group-hover:bg-[#D4A94D] group-hover:text-black">
        <Icon size={24} />
      </div>
      <h3 className="mb-2 font-heading text-2xl tracking-wide text-white">{title}</h3>
      <p className="font-sans text-sm text-gray-400">{desc}</p>
    </motion.div>
  );
}
