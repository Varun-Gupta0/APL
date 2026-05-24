"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { usePlayerStore } from "@/store/playerStore";
import { api, MatchSimulationResult, OverSummary, MatchEvent, SponsorOffer } from "@/lib/api";
import { Zap, Volume2, ShieldAlert, Trophy, Award, Sparkles, ChevronRight, UserPlus } from "lucide-react";
import Link from "next/link";

type MatchStep = "PRE_MATCH" | "SIMULATING" | "PLAYBACK" | "SUMMARY";

export default function MatchSimulationPage() {
  const { name = "VIRAJ SHARMA", personality = "Aggressive", teamName = "Mumbai Titans", loadPlayerFromBackend } = usePlayerStore();
  const simulateMatchOnBackend = usePlayerStore((s) => s.simulateMatchOnBackend);

  // Match Config State
  const [opponent, setOpponent] = useState("Delhi Dynamos");
  const [difficulty, setDifficulty] = useState(5);
  const [rivalryIntensity, setRivalryIntensity] = useState(70);
  const [venue, setVenue] = useState("Wankhede Stadium, Mumbai");

  // Flow State
  const [step, setStep] = useState<MatchStep>("PRE_MATCH");
  const [matchResult, setMatchResult] = useState<MatchSimulationResult | null>(null);

  // Playback State
  const [currentOverIndex, setCurrentOverIndex] = useState(0);
  const [currentBallIndex, setCurrentBallIndex] = useState(-1); // -1 means showing over intro
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500); // ms per ball

  // Hype Commentary Line
  const [hypeIndex, setHypeIndex] = useState(0);

  const startSimulation = async () => {
    setStep("SIMULATING");
    try {
      const res = await simulateMatchOnBackend({
        opponentName: opponent,
        opponentDifficulty: difficulty,
        rivalryIntensity,
        venue,
      });
      setMatchResult(res);
      setStep("PLAYBACK");
      setCurrentOverIndex(0);
      setCurrentBallIndex(-1);
    } catch (err) {
      console.error("Match simulation failed:", err);
      setStep("PRE_MATCH");
      alert("Failed to simulate match. Please try again.");
    }
  };

  const getActiveOver = (): OverSummary | null => {
    if (!matchResult || !matchResult.timeline.overs[currentOverIndex]) return null;
    return matchResult.timeline.overs[currentOverIndex];
  };

  const getActiveBall = (): MatchEvent | null => {
    const activeOver = getActiveOver();
    if (!activeOver || currentBallIndex === -1) return null;
    return activeOver.events[currentBallIndex] || null;
  };

  const nextBall = () => {
    if (!matchResult) return;
    const activeOver = getActiveOver();
    if (!activeOver) return;

    if (currentBallIndex < activeOver.events.length - 1) {
      setCurrentBallIndex((prev) => prev + 1);
    } else {
      // Move to next over
      if (currentOverIndex < matchResult.timeline.overs.length - 1) {
        setCurrentOverIndex((prev) => prev + 1);
        setCurrentBallIndex(-1);
      } else {
        // Match finished
        setIsPlaying(false);
        setStep("SUMMARY");
        // Reload player profile to sync stats
        loadPlayerFromBackend();
      }
    }
  };

  // Auto playback loop
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        nextBall();
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentOverIndex, currentBallIndex, playbackSpeed, matchResult]);

  // Pre-match commentary progression timer
  useEffect(() => {
    if (step === "PLAYBACK" && currentBallIndex === -1 && matchResult && matchResult.preMatchCommentary.length > 0) {
      const timer = setInterval(() => {
        setHypeIndex((prev) => (prev + 1) % matchResult.preMatchCommentary.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [step, currentBallIndex, matchResult]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* PRE_MATCH: Configuration Setup */}
        {step === "PRE_MATCH" && (
          <div className="space-y-6">
            <SectionHeader title="Match Day Setup" subtitle={`Prepare ${name} for the next big league game`} />
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-6 space-y-5">
                <h3 className="font-heading text-xl text-white tracking-wide">MATCH DETAILS</h3>
                
                {/* Opponent Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Opponent Team</label>
                  <select 
                    value={opponent} 
                    onChange={(e) => setOpponent(e.target.value)}
                    className="w-full bg-[#0B1220] border border-[#16233B] rounded-lg py-2.5 px-4 text-white text-sm font-semibold outline-none focus:border-[#D4A94D] cursor-pointer"
                  >
                    <option>Delhi Destroyers</option>
                    <option>Mumbai Mavericks</option>
                    <option>Bangalore Blazers</option>
                    <option>Chennai Champions</option>
                    <option>Kolkata Knights</option>
                    <option>Punjab Panthers</option>
                    <option>Rajasthan Royals XI</option>
                    <option>Hyderabad Hurricanes</option>
                  </select>
                </div>

                {/* Venue Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Stadium / Venue</label>
                  <select 
                    value={venue} 
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-[#0B1220] border border-[#16233B] rounded-lg py-2.5 px-4 text-white text-sm font-semibold outline-none focus:border-[#D4A94D] cursor-pointer"
                  >
                    <option>Wankhede Stadium, Mumbai</option>
                    <option>Eden Gardens, Kolkata</option>
                    <option>M. Chinnaswamy Stadium, Bangalore</option>
                    <option>Narendra Modi Stadium, Ahmedabad</option>
                    <option>MA Chidambaram Stadium, Chennai</option>
                  </select>
                </div>

                {/* Opponent Difficulty Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs uppercase font-bold text-gray-400">
                    <span>Bowler Difficulty</span>
                    <span className="text-[#D4A94D]">{difficulty} / 10</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(parseInt(e.target.value, 10))}
                    className="w-full accent-[#D4A94D] bg-[#0B1220] h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Rivalry Intensity Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs uppercase font-bold text-gray-400">
                    <span>Rivalry Tension</span>
                    <span className="text-red-400">{rivalryIntensity}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" 
                    value={rivalryIntensity} 
                    onChange={(e) => setRivalryIntensity(parseInt(e.target.value, 10))}
                    className="w-full accent-red-500 bg-[#0B1220] h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <button 
                  onClick={startSimulation}
                  className="w-full bg-[#D4A94D] hover:bg-[#C59B3F] active:scale-[0.99] transition-all text-[#0B1220] font-heading font-extrabold text-lg py-4 rounded-xl tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg"
                >
                  <Zap size={18} className="fill-[#0B1220]" /> START SIMULATION
                </button>
              </div>

              {/* Cinematic Hype Poster */}
              <div className="relative rounded-xl overflow-hidden border border-red-500/20 bg-black/60 flex flex-col justify-end p-8 min-h-[350px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent z-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />
                <div className="relative z-10 text-center space-y-4">
                  <span className="inline-block rounded-full bg-red-500/20 px-4 py-1 text-xs font-bold text-red-400 border border-red-500/30 uppercase tracking-widest">
                    CINEMATIC SHOWDOWN
                  </span>
                  <h2 className="font-heading text-4xl text-white tracking-wide uppercase italic">
                    {teamName} <br />
                    <span className="text-red-500 text-3xl font-sans not-italic font-bold">VS</span> <br />
                    {opponent}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                    The lights are bright, the crowd is deafening. Live the drama, absorb the pressure, and create history on the pitch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIMULATING: Loading & Generating Narrative */}
        {step === "SIMULATING" && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 bg-[#101A2E]/50 rounded-2xl border border-[#16233B] text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-[#D4A94D]/20 opacity-75" />
              <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#D4A94D] border-t-transparent" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-2xl text-white tracking-wider animate-pulse">
                GENERATING CINEMATIC MATCH NARRATIVE...
              </h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                Gemini is orchestrating the overs, writing dramatic commentary, and planning clutch moments...
              </p>
            </div>
          </div>
        )}

        {/* PLAYBACK: Interactive over-by-over simulator */}
        {step === "PLAYBACK" && matchResult && (
          <div className="space-y-6">
            {/* Playback Header bar */}
            <div className="flex justify-between items-center bg-[#101A2E] p-4 rounded-xl border border-[#16233B]">
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Live Coverage</p>
                <h2 className="font-heading text-lg text-white">
                  {teamName} vs {matchResult.timeline.opponentName}
                </h2>
              </div>
              
              {/* Playback Speed Controller */}
              <div className="flex items-center gap-4">
                <select 
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseInt(e.target.value, 10))}
                  className="bg-[#0B1220] border border-[#16233B] rounded py-1 px-2 text-xs font-bold text-gray-400 outline-none"
                >
                  <option value={2000}>1.0x (Slow)</option>
                  <option value={1200}>1.5x (Normal)</option>
                  <option value={700}>2.0x (Fast)</option>
                </select>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`rounded px-4 py-1.5 text-xs font-bold uppercase transition-all ${
                      isPlaying 
                        ? "bg-red-600 text-white" 
                        : "bg-[#D4A94D] text-black"
                    }`}
                  >
                    {isPlaying ? "Pause" : "Auto Play"}
                  </button>
                  <button 
                    onClick={nextBall}
                    className="bg-[#16233B] hover:bg-[#1f3152] rounded px-4 py-1.5 text-xs font-bold text-white uppercase"
                  >
                    Next Ball
                  </button>
                </div>
              </div>
            </div>

            {/* Main Simulator Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Left & Middle Column: Broadcaster Simulation & Event log */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Scoreboard Widget */}
                <div className="grid grid-cols-3 gap-4 bg-[#101A2E]/80 p-6 rounded-xl border border-[#16233B]">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Overs Played</p>
                    <p className="font-heading text-3xl text-white mt-1">
                      {currentBallIndex === -1 ? currentOverIndex : `${currentOverIndex}.${currentBallIndex + 1}`}
                    </p>
                  </div>
                  <div className="text-center border-l border-r border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team Score</p>
                    <p className="font-heading text-3xl text-[#D4A94D] mt-1">
                      {getActiveBall() ? getActiveBall()?.teamScore : matchResult.timeline.overs[currentOverIndex]?.scoreAtEnd.split("/")[0] || "0"}
                      <span className="text-xl text-gray-400">/{getActiveBall() ? getActiveBall()?.wickets : matchResult.timeline.overs[currentOverIndex]?.scoreAtEnd.split("/")[1] || "0"}</span>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{name}&apos;s Runs</p>
                    <p className="font-heading text-3xl text-white mt-1">
                      {getActiveBall() ? getActiveBall()?.playerRuns : "0"}
                    </p>
                  </div>
                </div>

                {/* Cinematic Highlight Video / Drama screen */}
                <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-white/10 flex flex-col justify-center items-center p-8">
                  {/* Backdrop glowing background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent z-0" />
                  
                  <div className="relative z-10 text-center space-y-6 max-w-lg">
                    {currentBallIndex === -1 ? (
                      // Showing Pre-Match Commentary
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <span className="inline-block rounded-full bg-red-500/20 px-3 py-0.5 text-[10px] font-bold text-red-400 tracking-widest uppercase">
                          Broadcasting Live
                        </span>
                        <blockquote className="font-heading text-2xl text-white italic leading-relaxed uppercase tracking-wide">
                          &ldquo;{matchResult.preMatchCommentary[hypeIndex]?.text}&rdquo;
                        </blockquote>
                        <cite className="block text-xs font-bold text-[#D4A94D] uppercase tracking-wider">
                          — Comm Box ({matchResult.preMatchCommentary[hypeIndex]?.tone})
                        </cite>
                      </motion.div>
                    ) : (
                      // Showing ball-by-ball event highlights
                      <AnimatePresence mode="wait">
                        {getActiveBall() && (
                          <motion.div
                            key={`${currentOverIndex}-${currentBallIndex}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-4"
                          >
                            {/* Milestone or highlight banner */}
                            {getActiveBall()?.isHighlight && (
                              <motion.span 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`inline-block rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-widest shadow-md ${
                                  getActiveBall()?.isSix
                                    ? "bg-amber-500 text-black shadow-amber-500/20"
                                    : getActiveBall()?.isWicket
                                    ? "bg-red-600 text-white shadow-red-600/20"
                                    : "bg-blue-600 text-white shadow-blue-600/20"
                                }`}
                              >
                                {getActiveBall()?.eventType === "CLUTCH_MOMENT"
                                  ? "🔥 CLUTCH MOMENT"
                                  : getActiveBall()?.isSix
                                  ? "🏏 MASSIVE SIX!"
                                  : getActiveBall()?.isWicket
                                  ? "🚨 WICKET!"
                                  : "💥 BOUNDARY"}
                              </motion.span>
                            )}

                            <h1 className="font-heading text-3xl text-white tracking-wide leading-snug uppercase">
                              {getActiveBall()?.cinematic}
                            </h1>

                            <p className="font-sans text-sm text-gray-400 max-w-md mx-auto leading-relaxed border-t border-white/5 pt-4">
                              {getActiveBall()?.description}
                            </p>

                            {/* Crowd reactions and noise */}
                            <div className="flex justify-center items-center gap-6 text-xs text-gray-500 font-sans mt-4">
                              <span className="flex items-center gap-1">
                                <Volume2 size={12} className="text-[#D4A94D]" />
                                Sound: <strong className="text-white uppercase">{getActiveBall()?.crowdSound}</strong>
                              </span>
                              <span className="flex items-center gap-1">
                                <Sparkles size={12} className="text-purple-400" />
                                Momentum Shift: <strong className={getActiveBall()!.momentumShift >= 0 ? "text-emerald-400" : "text-red-400"}>
                                  {getActiveBall()!.momentumShift >= 0 ? "+" : ""}{getActiveBall()?.momentumShift}
                                </strong>
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </div>

                {/* Over Events Timeline history */}
                <div className="bg-[#101A2E]/50 p-6 rounded-xl border border-[#16233B]">
                  <h3 className="mb-4 font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Over Timeline — Over {currentOverIndex + 1}
                  </h3>
                  <div className="flex gap-2 justify-between flex-wrap">
                    {getActiveOver()?.events.map((evt, idx) => {
                      const isPlayed = idx <= currentBallIndex;
                      return (
                        <div 
                          key={idx}
                          className={`flex-1 min-w-[48px] h-14 rounded-lg flex flex-col justify-center items-center border transition-all ${
                            isPlayed
                              ? evt.isSix
                                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                                : evt.isWicket
                                ? "bg-red-500/20 border-red-500 text-red-500 font-bold"
                                : evt.isBoundary
                                ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                : "bg-[#16233B] border-white/10 text-white"
                              : "bg-[#0B1220] border-white/5 text-gray-700"
                          }`}
                        >
                          <span className="text-[9px] font-sans font-bold text-gray-500">{evt.overBall}</span>
                          <span className="text-sm font-heading font-extrabold mt-0.5">
                            {isPlayed 
                              ? evt.isSix 
                                ? "6" 
                                : evt.isWicket 
                                ? "W" 
                                : evt.isBoundary 
                                ? evt.runs 
                                : evt.runs 
                              : "-"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Intensity Indicators, Tension, and Comments */}
              <div className="space-y-6">
                
                {/* Tension Meter Widget */}
                <div className="bg-[#101A2E]/80 p-6 rounded-xl border border-[#16233B] space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold tracking-widest text-gray-400 uppercase">
                    <span className="flex items-center gap-1">
                      <ShieldAlert size={14} className="text-red-500" />
                      Tension Meter
                    </span>
                    <span className="font-sans text-red-500">{getActiveBall()?.tensionLevel || 50}%</span>
                  </div>
                  <div className="h-4 w-full bg-[#0B1220] rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                      initial={{ width: "50%" }}
                      animate={{ width: `${getActiveBall()?.tensionLevel || 50}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    Higher tension increases momentum swings and risk of wickets, but grants massive confidence multipliers on boundaries.
                  </p>
                </div>

                {/* Hype Score & Clutch Metrics */}
                <div className="bg-[#101A2E]/80 p-6 rounded-xl border border-[#16233B] space-y-6">
                  <h3 className="font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Narrative Intensity
                  </h3>
                  
                  {/* Hype Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                      <span>Match Hype</span>
                      <span className="text-amber-400">{matchResult.timeline.hypeScore}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0B1220] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${matchResult.timeline.hypeScore}%` }} />
                    </div>
                  </div>

                  {/* Crowd Energy */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                      <span>Crowd Energy</span>
                      <span className="text-blue-400">{getActiveBall()?.crowdEnergy || 50}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0B1220] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-400" 
                        animate={{ width: `${getActiveBall()?.crowdEnergy || 50}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Momentum Index */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                      <span>Team Momentum</span>
                      <span className="text-emerald-400">{getActiveBall()?.momentum || 50}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0B1220] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-emerald-400" 
                        animate={{ width: `${getActiveBall()?.momentum || 50}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Comm Box Commentary Lines Ticker */}
                <div className="bg-[#101A2E]/50 p-6 rounded-xl border border-[#16233B]">
                  <h3 className="mb-4 font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Broadcaster commentary
                  </h3>
                  <div className="h-[150px] overflow-y-auto space-y-3 pr-2 scrollbar-custom">
                    {matchResult.timeline.overs
                      .slice(0, currentOverIndex + 1)
                      .map((ovr, oIdx) => {
                        const showAllBalls = oIdx < currentOverIndex;
                        const ballsToShow = showAllBalls ? ovr.events : ovr.events.slice(0, currentBallIndex + 1);
                        
                        return (
                          <div key={oIdx} className="space-y-2">
                            {ballsToShow
                              .filter(b => b.isHighlight)
                              .map((evt, eIdx) => (
                                <div key={eIdx} className="text-xs p-2 rounded bg-black/20 border-l-2 border-[#D4A94D]">
                                  <span className="font-bold text-[#D4A94D] mr-2">[{evt.overBall}]</span>
                                  <span className="text-gray-300 italic">{evt.cinematic}</span>
                                </div>
                              ))}
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* SUMMARY: Detailed Scorecard, XP Progression, Endorsements */}
        {step === "SUMMARY" && matchResult && (
          <div className="space-y-6">
            <SectionHeader title="Match Summary" subtitle={`Career Progression Report · ${name}`} />

            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Scorecard and Stats */}
              <div className="md:col-span-2 rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-6 space-y-6">
                <div>
                  <span className="inline-block rounded bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400 border border-green-500/30 uppercase tracking-wider mb-2">
                    {matchResult.timeline.result}
                  </span>
                  <h2 className="font-heading text-3xl text-white uppercase">
                    {teamName} VS {matchResult.timeline.opponentName}
                  </h2>
                  <p className="text-xs text-gray-400">{venue} · {matchResult.timeline.matchType} Match</p>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-b border-white/5 py-6 text-center">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Runs Scored</p>
                    <p className="font-heading text-4xl text-[#D4A94D] mt-1">{matchResult.timeline.playerRuns}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Wickets Taken</p>
                    <p className="font-heading text-4xl text-white mt-1">{matchResult.timeline.playerWickets}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hype Score</p>
                    <p className="font-heading text-4xl text-purple-400 mt-1">{matchResult.timeline.hypeScore}</p>
                  </div>
                </div>

                {/* Level Up Notification Modal banner */}
                {matchResult.progression.leveledUp && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-[#D4A94D] to-[#B48A1B] text-black border-2 border-white/30 shadow-[0_0_30px_rgba(212,169,77,0.4)] relative overflow-hidden"
                  >
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-6 translate-x-6">
                      <Trophy size={160} />
                    </div>
                    <div className="relative z-10 flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-[10px] font-black tracking-[0.25em] text-black/60 uppercase">
                        <Sparkles size={12} /> LEVEL UP
                      </span>
                      <h3 className="font-heading text-3xl font-extrabold italic tracking-wide">
                        {matchResult.progression.newTitle || "Rookie Sensation"}
                      </h3>
                      <p className="text-sm font-sans font-semibold text-black/75 mt-1">
                        You have unlocked the milestone: <strong className="underline">{matchResult.progression.unlockedMilestone}</strong>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* XP and Fan Growth Progress */}
                <div className="space-y-4">
                  <h3 className="font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">Growth Metrics</h3>
                  
                  {/* XP Gain */}
                  <div className="space-y-2 bg-black/20 p-4 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center text-xs font-bold uppercase">
                      <span className="text-gray-400">XP Gained</span>
                      <span className="text-[#D4A94D]">+{matchResult.xpEarned} XP</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-sans">
                      New Total: {matchResult.progression.xpTotal} XP
                    </p>
                  </div>

                  {/* Followers Gain */}
                  <div className="space-y-2 bg-black/20 p-4 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center text-xs font-bold uppercase">
                      <span className="text-gray-400">New Fans & Followers</span>
                      <span className="text-blue-400">+{matchResult.followersGained.toLocaleString()} Fans</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-sans">
                      New Base: {matchResult.progression.followersTotal.toLocaleString()} Fans
                    </p>
                  </div>
                </div>
              </div>

              {/* Endorsements / Sponsors Panel */}
              <div className="rounded-xl border border-[#16233B] bg-[#101A2E]/80 p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading text-xl text-white tracking-wide">SPONSOR OFFERS</h3>
                    <p className="text-xs text-gray-400 mt-1">New endorsement contracts unlocked by your display</p>
                  </div>

                  <div className="space-y-4">
                    {matchResult.sponsors && matchResult.sponsors.length > 0 ? (
                      matchResult.sponsors.map((sponsor) => (
                        <div 
                          key={sponsor.id}
                          className="p-4 rounded-lg bg-[#0B1220] border border-[#16233B] space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{sponsor.logoEmoji || "🏷️"}</span>
                            <div>
                              <h4 className="font-heading text-sm text-white">{sponsor.brand}</h4>
                              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{sponsor.category}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                            <span className="text-[#D4A94D] font-heading font-bold text-sm">{sponsor.offerValue}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{sponsor.expiresIn}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 italic text-center py-8">
                        No sponsor offers unlocked in this match. Complete more dramatic boundaries to trigger interest.
                      </p>
                    )}
                  </div>
                </div>

                <Link href="/dashboard">
                  <button className="w-full bg-[#D4A94D] hover:bg-[#C59B3F] active:scale-[0.99] transition-all text-[#0B1220] font-heading font-extrabold text-sm py-4.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-1 shadow-lg mt-6">
                    RETURN TO DASHBOARD
                    <ChevronRight size={16} />
                  </button>
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
