"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/playerStore";

const PORTRAITS = [
  "https://lh3.googleusercontent.com/aida/ADBb0uhajcPZG5jQ1NbAfWM_9vQr3aO3neQWBTJkxVykHDcaHAlvbYkgqfWkKufBrjK_HuUjwwLPjRKx9HSaWS73SlnmkJo285WfnlGyFxz5OH0S1Xcs13mc9xd5tM5SVUTfvLBOUNS2Thek3WsuXSUNpFMnRrAMSsQ_xafg7f0iKf9-43CFgn40rs7zAxHBP-dbLXd9Zpy3gYmHY9e5TrkO8suOH2yr-xPUnmrKra5485thFlmxGEEaLPZ7Xqc",
  "https://lh3.googleusercontent.com/aida/ADBb0uinku_iZrXqbYYISPuPBmvdhpVhI3-bq6c4wjSUCHl-GfHf4OIYEfPloM6FdBRS3gIrRS2KRSm1lRB6oU3yhreFDGxroFLkxOpSpp124bB3ea0pYQ__ixcDsqCigJe7R97ajKf22OqbH6Ep8RpKX-l3bMvhZLHrhH5kZ1Ue-9c2xdjhxZFC6FWPLiYVmrs8u4BweADAR3_tiv3TVToZfM_-vCuvx6mz4xW-abfwjGhb118V0N91jOwG6ys",
  "https://lh3.googleusercontent.com/aida/ADBb0uiXq6jPlK5ti63iPq6Uryfl1tMA7XH0k9GBpWsIF4TcVwyhdB66fPyRV5Uo-0M8hY2Gk77bA9fCWtLhoHzf2oCWNiolzK9GtDx_iIftjJAnx0s99lqpw5qT8m9TbQTri7tQijoazEQ9B3CktaGNrrRXQvm-40Giu1Hilyfyy8Czfm101TqgNvOvemoAgmCk5sPP_VlWUbDL8UcGy31D1VGxxLHTvqH1mQFd7ZLMKVfzsS7BgeXzVeV2L40"
];

export default function CreatePlayerPage() {
  const router = useRouter();
  const createPlayerOnBackend = usePlayerStore((s) => s.createPlayerOnBackend);
  const isCreated = usePlayerStore((s) => s.isCreated);
  const teamSelected = usePlayerStore((s) => s.teamSelected);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [unlockedSpecialty, setUnlockedSpecialty] = useState<string | null>(null);
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);

  // Form fields
  const [playerName, setPlayerName] = useState("");
  const [role, setRole] = useState("Batsman");
  const [personality, setPersonality] = useState("Aggressive");
  const [battingStyle, setBattingStyle] = useState("Right Handed");
  const [bowlingStyle, setBowlingStyle] = useState("Right Arm Medium");
  const [specialty, setSpecialty] = useState("Finisher");

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (usePlayerStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = usePlayerStore.persist.onFinishHydration(() => setHydrated(true));
      return () => unsub();
    }
  }, []);

  // Dynamic Stats State
  const [stats, setStats] = useState({
    bat: 72,
    bowl: 45,
    field: 60,
    mental: 66,
    fitness: 70
  });

  // Calculate dynamic stats based on role and specialty
  useEffect(() => {
    let baseBat = 65;
    let baseBowl = 65;
    let baseField = 62;
    let baseMental = 66;
    let baseFitness = 70;

    if (role === "Batsman") {
      baseBat = 74;
      baseBowl = 32;
      baseField = 62;
      baseMental = 65;
      baseFitness = 68;
    } else if (role === "Bowler") {
      baseBat = 28;
      baseBowl = 75;
      baseField = 60;
      baseMental = 68;
      baseFitness = 72;
    } else if (role === "All-Rounder") {
      baseBat = 66;
      baseBowl = 64;
      baseField = 64;
      baseMental = 66;
      baseFitness = 70;
    }

    // Apply specialty modifiers
    switch (specialty) {
      case "Finisher":
        baseBat += 4;
        baseMental += 4;
        break;
      case "Power Hitter":
        baseBat += 6;
        baseFitness += 2;
        baseBowl = Math.max(10, baseBowl - 4);
        break;
      case "Anchor":
        baseBat += 2;
        baseMental += 6;
        break;
      case "Swing Specialist":
        baseBowl += 6;
        baseField += 2;
        break;
      case "Death Over Specialist":
        baseBowl += 8;
        baseMental += 2;
        break;
    }

    setStats({
      bat: baseBat,
      bowl: baseBowl,
      field: baseField,
      mental: baseMental,
      fitness: baseFitness
    });
  }, [role, specialty]);

  // Calculate overall rating
  const ovr = Math.round(
    role === "Batsman"
      ? stats.bat * 0.6 + stats.mental * 0.2 + stats.fitness * 0.1 + stats.field * 0.1
      : role === "Bowler"
      ? stats.bowl * 0.6 + stats.mental * 0.2 + stats.fitness * 0.1 + stats.field * 0.1
      : (stats.bat + stats.bowl) * 0.35 + stats.mental * 0.15 + stats.fitness * 0.1 + stats.field * 0.05
  );

  const handleCreatePlayer = async () => {
    await createPlayerOnBackend({
      name: playerName.trim() || "VIRAJ SHARMA",
      role,
      personality,
      battingStyle,
      bowlingStyle,
      specialty,
      portraitIndex: currentSlide,
    });
    router.push("/team-select");
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSpecialty(value);
      setUnlockedSpecialty(value);
      setShowUnlockAnim(true);
      setTimeout(() => setShowUnlockAnim(false), 2200);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % PORTRAITS.length);
  };

  return (
    <div className="bg-[#F3F4F6] text-slate-800 min-h-screen font-sans antialiased">
      {/* Unlock Animation Overlay */}
      <AnimatePresence>
        {showUnlockAnim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[100] bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-br from-[#D4AF37] to-[#B48A1B] border-2 border-white/40 shadow-[0_0_35px_rgba(212,175,55,0.7)] px-8 py-6 rounded-2xl flex flex-col items-center gap-2 max-w-sm text-center text-white"
            >
              <span className="material-symbols-outlined text-4xl animate-bounce">stars</span>
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] text-white/80 uppercase">Speciality Unlocked</p>
                <h3 className="font-heading font-extrabold text-2xl uppercase italic tracking-wide mt-1">
                  {unlockedSpecialty}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TopAppBar */}
      <header className="bg-white/90 backdrop-blur-md fixed top-0 w-full z-[70] border-b border-slate-200/80">
        <div className="flex justify-between items-center px-8 py-4 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D4A94D] text-2xl">sports_cricket</span>
            <span className="font-heading font-extrabold italic text-slate-900 text-xl tracking-widest">ATHLETE//ZERO</span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-slate-600 hover:text-slate-900 font-bold text-xs tracking-wider uppercase" href="/team-select">DASHBOARD</Link>
              <Link className="text-[#D4A94D] font-bold text-xs tracking-wider uppercase" href="/create-player">PLAYER</Link>
            </nav>
            <span className="material-symbols-outlined text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-xl">account_circle</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 max-w-5xl mx-auto px-4">
        {/* Step Indicator */}
        <div className="text-center mb-6">
          <p className="text-[11px] font-bold text-slate-500 tracking-[0.3em] uppercase">2. CREATE YOUR PLAYER</p>
        </div>

        {/* Form + Card Wrapper */}
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl bg-white border border-slate-200/80">
          
          {/* Left Side: Form Section */}
          <section className="w-full md:w-[58%] p-8 lg:p-12">
            <header className="mb-6">
              <h1 className="font-heading font-extrabold text-3xl text-slate-900 uppercase tracking-wide">
                CREATE YOUR CRICKETER
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Your journey begins now
              </p>
            </header>

            <div className="space-y-5">
              {/* Player Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Player Name
                </label>
                <div className="relative">
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-800 text-sm font-semibold placeholder-slate-400"
                    placeholder="Enter Full Name"
                    type="text"
                  />
                  {playerName.trim().length > 2 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 material-symbols-outlined text-lg font-bold">
                      check
                    </span>
                  )}
                </div>
              </div>

              {/* Batsman / Bowler (Role) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Batsman / Bowler
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
                  >
                    <option>Batsman</option>
                    <option>Bowler</option>
                    <option>All-Rounder</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Batting Style */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Batting Style
                </label>
                <div className="relative">
                  <select
                    value={battingStyle}
                    onChange={(e) => setBattingStyle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
                  >
                    <option>Right Handed</option>
                    <option>Left Handed</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Bowling Style */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Bowling Style
                </label>
                <div className="relative">
                  <select
                    value={bowlingStyle}
                    onChange={(e) => setBowlingStyle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
                  >
                    <option>Right Arm Medium</option>
                    <option>Right Arm Fast</option>
                    <option>Left Arm Fast</option>
                    <option>Right Arm Off Spin</option>
                    <option>Right Arm Leg Spin</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Personality */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Personality
                </label>
                <div className="relative">
                  <select
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
                  >
                    <option>Aggressive</option>
                    <option>Tactical</option>
                    <option>Balanced</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Specialty */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Speciality
                </label>
                <div className="relative">
                  <select
                    value={specialty}
                    onChange={handleSpecialtyChange}
                    className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-800 text-sm font-semibold appearance-none cursor-pointer"
                  >
                    <option value="Finisher">Finisher</option>
                    <option value="Power Hitter">Power Hitter</option>
                    <option value="Anchor">Anchor</option>
                    <option value="Swing Specialist">Swing Specialist</option>
                    <option value="Death Over Specialist">Death Over Specialist</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={handleCreatePlayer}
                  className="w-full bg-[#D4A94D] hover:bg-[#C59B3F] active:scale-[0.99] transition-all text-[#0B1220] font-heading text-lg py-3.5 px-6 rounded-lg uppercase tracking-widest font-extrabold flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
                >
                  CREATE PLAYER
                </button>
              </div>
            </div>
          </section>

          {/* Right Side: Premium Broadcast Preview Card */}
          <section className="w-full md:w-[42%] bg-[#0A0F1C] text-white p-8 flex flex-col justify-between relative overflow-hidden min-h-[550px] md:min-h-auto">
            {/* Ambient Background Gold Dust Particle overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-60 pointer-events-none z-0" />
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              {/* Header section inside card */}
              <div className="flex justify-between items-start">
                {/* Pencil/Edit Action */}
                <button
                  onClick={nextSlide}
                  title="Change Portrait"
                  className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors border border-white/10 flex items-center justify-center active:scale-90"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>

                {/* Rating Display */}
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">OVR</p>
                  <h4 className="font-heading text-5xl font-extrabold text-white leading-none tracking-tight">
                    {ovr}
                  </h4>
                  <p className="text-[11px] font-extrabold text-[#D4A94D] tracking-wider uppercase mt-1">
                    {role === "Batsman" ? "BAT" : role === "Bowler" ? "BOWL" : "AR"}
                  </p>
                </div>
              </div>

              {/* Portrait Holder with Ken Burns effect transition */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-70">
                {PORTRAITS.map((src, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <img
                      key={idx}
                      src={src}
                      alt="Player portrait preview"
                      className={`absolute bottom-0 w-full h-[85%] object-cover object-bottom transition-all duration-700 ${
                        isActive ? "opacity-100 scale-100 filter-none" : "opacity-0 scale-95 blur-sm"
                      }`}
                    />
                  );
                })}
                {/* Overlay vignette/fade-to-black bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/25 to-[#0A0F1C]/10" />
              </div>

              {/* Bottom Identity + Stats Overlay */}
              <div className="mt-auto relative z-10">
                {/* Identity */}
                <div className="text-center mb-4">
                  <h2 className="font-heading font-extrabold text-3xl tracking-wide uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {playerName.trim() || "VIRAJ SHARMA"}
                  </h2>
                  <p className="text-[#D4A94D] text-xs font-bold tracking-[0.25em] uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-1">
                    {specialty ? specialty : "THE FINISHER"}
                  </p>
                </div>

                {/* Stat Row */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center text-center px-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider">BAT</span>
                      <span className="text-base font-heading font-bold text-white mt-0.5">{stats.bat}</span>
                    </div>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider">BOWL</span>
                      <span className="text-base font-heading font-bold text-white mt-0.5">{stats.bowl}</span>
                    </div>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider">FIELD</span>
                      <span className="text-base font-heading font-bold text-white mt-0.5">{stats.field}</span>
                    </div>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider">MENTAL</span>
                      <span className="text-base font-heading font-bold text-white mt-0.5">{stats.mental}</span>
                    </div>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider">FITNESS</span>
                      <span className="text-base font-heading font-bold text-white mt-0.5">{stats.fitness}</span>
                    </div>
                  </div>
                </div>

                {/* Bullet Line */}
                <div className="w-full h-px bg-white/10 my-4 flex justify-center items-center relative">
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#D4A94D]" />
                </div>

                {/* Quote Block */}
                <div className="text-center px-2">
                  <blockquote className="font-sans text-xs italic text-slate-300 leading-relaxed">
                    &quot;Talent gets you noticed. Attitude makes you unforgettable.&quot;
                  </blockquote>
                  <cite className="text-[#D4A94D] font-serif text-sm block text-right mt-1 italic pr-4 not-styled">
                    — Coach
                  </cite>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
