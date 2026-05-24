"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, BackendPlayer, MatchSimulationResult, SponsorOffer } from "@/lib/api";

export interface PlayerState {
  // Player Identity
  name: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  personality: string;
  specialty: string;
  portraitIndex: number;
  teamName: string;

  // Career Stats
  ovr: number;
  level: number;
  fans: number;
  xp: number;
  xpToNext: number;
  confidence: number;
  fitness: number;
  reputation: number;
  totalMatches: number;
  totalRuns: number;
  totalWickets: number;

  // Match & Rival State
  currentRival: string | null;
  sponsorOffers: SponsorOffer[];
  latestMatchResult: MatchSimulationResult | null;

  // Career Status
  isCreated: boolean;
  teamSelected: boolean;

  // Local Actions
  setPlayer: (data: Partial<Omit<PlayerState, "setPlayer" | "addXp" | "addFans" | "setTeam" | "reset" | "loadPlayerFromBackend" | "createPlayerOnBackend" | "simulateMatchOnBackend" | "acceptSponsorOffer">>) => void;
  setTeam: (teamName: string) => void;
  addXp: (amount: number) => void;
  addFans: (amount: number) => void;
  reset: () => void;

  // Backend Sync Actions
  loadPlayerFromBackend: () => Promise<void>;
  createPlayerOnBackend: (formData: {
    name: string;
    role: string;
    battingStyle: string;
    bowlingStyle: string;
    personality: string;
    specialty: string;
    portraitIndex: number;
  }) => Promise<void>;
  simulateMatchOnBackend: (params: {
    opponentName?: string;
    opponentDifficulty?: number;
    rivalryIntensity?: number;
    venue?: string;
    matchType?: string;
    isPlayoffMatch?: boolean;
  }) => Promise<MatchSimulationResult>;
  acceptSponsorOffer: (id: string) => void;
}

// Helpers to map display fields to backend enums
function mapRoleToBackend(role: string): "BATSMAN" | "BOWLER" | "ALL_ROUNDER" | "WICKET_KEEPER" {
  const norm = role.toLowerCase().replace(/[^a-z]/g, "");
  if (norm === "batsman") return "BATSMAN";
  if (norm === "bowler") return "BOWLER";
  if (norm === "allrounder") return "ALL_ROUNDER";
  if (norm === "wicketkeeper") return "WICKET_KEEPER";
  return "ALL_ROUNDER";
}

function mapBattingStyleToBackend(style: string): "RIGHT_HAND" | "LEFT_HAND" {
  const norm = style.toLowerCase();
  if (norm.includes("left")) return "LEFT_HAND";
  return "RIGHT_HAND";
}

function mapBowlingStyleToBackend(style: string): "FAST" | "MEDIUM" | "SPIN" | "NONE" {
  const norm = style.toLowerCase();
  if (norm.includes("fast")) return "FAST";
  if (norm.includes("medium")) return "MEDIUM";
  if (norm.includes("spin")) return "SPIN";
  return "NONE";
}

function mapPersonalityToBackend(p: string): "AGGRESSIVE" | "CALM" | "SHOWMAN" | "UNDERDOG" | "VETERAN" {
  const norm = p.toLowerCase();
  if (norm.includes("aggressive")) return "AGGRESSIVE";
  if (norm.includes("calm") || norm.includes("tactical") || norm.includes("balanced")) return "CALM";
  if (norm.includes("showman")) return "SHOWMAN";
  if (norm.includes("underdog")) return "UNDERDOG";
  return "VETERAN";
}

function mapSpecialtyToBackend(s: string): "BIG_HITTER" | "SPIN_WIZARD" | "PACE_KING" | "CLUTCH_PLAYER" | "STREET_FIGHTER" | "ANCHOR" {
  const norm = s.toLowerCase().replace(/[^a-z]/g, "");
  if (norm === "finisher") return "CLUTCH_PLAYER";
  if (norm === "powerhitter") return "BIG_HITTER";
  if (norm === "anchor") return "ANCHOR";
  if (norm === "swingspecialist") return "PACE_KING";
  if (norm === "deathoverspecialist") return "PACE_KING";
  return "CLUTCH_PLAYER";
}

// Helpers to map backend enums back to display fields
function mapRoleToFrontend(role: string): string {
  if (role === "BATSMAN") return "Batsman";
  if (role === "BOWLER") return "Bowler";
  if (role === "ALL_ROUNDER") return "All-Rounder";
  if (role === "WICKET_KEEPER") return "Wicketkeeper";
  return role;
}

function mapBattingStyleToFrontend(style: string): string {
  if (style === "RIGHT_HAND") return "Right Handed";
  if (style === "LEFT_HAND") return "Left Handed";
  return style;
}

function mapBowlingStyleToFrontend(style: string): string {
  if (style === "FAST") return "Right Arm Fast";
  if (style === "MEDIUM") return "Right Arm Medium";
  if (style === "SPIN") return "Right Arm Leg Spin";
  if (style === "NONE") return "None";
  return style;
}

function mapPersonalityToFrontend(p: string): string {
  if (p === "AGGRESSIVE") return "Aggressive";
  if (p === "CALM") return "Tactical";
  return p;
}

function mapSpecialtyToFrontend(s: string): string {
  if (s === "CLUTCH_PLAYER") return "Finisher";
  if (s === "BIG_HITTER") return "Power Hitter";
  if (s === "ANCHOR") return "Anchor";
  if (s === "PACE_KING") return "Pace Specialist";
  if (s === "SPIN_WIZARD") return "Spin Specialist";
  return s;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Defaults
      name: "VIRAJ SHARMA",
      role: "Batsman",
      battingStyle: "Right-Handed",
      bowlingStyle: "Fast",
      personality: "Aggressive",
      specialty: "",
      portraitIndex: 0,
      teamName: "Mumbai Titans",

      ovr: 68,
      level: 1,
      fans: 12500,
      xp: 0,
      xpToNext: 100,
      confidence: 78,
      fitness: 80,
      reputation: 30,
      totalMatches: 0,
      totalRuns: 0,
      totalWickets: 0,

      currentRival: "Arjun Patel",
      sponsorOffers: [],
      latestMatchResult: null,

      isCreated: false,
      teamSelected: false,

      setPlayer: (data) => set((state) => ({ ...state, ...data, isCreated: true })),
      setTeam: (teamName) => set({ teamName, teamSelected: true }),
      addXp: (amount) =>
        set((state) => {
          const newXp = state.xp + amount;
          if (newXp >= state.xpToNext) {
            return { xp: newXp - state.xpToNext, xpToNext: Math.floor(state.xpToNext * 1.4), level: state.level + 1, ovr: Math.min(state.ovr + 1, 99) };
          }
          return { xp: newXp };
        }),
      addFans: (amount) => set((state) => ({ fans: state.fans + amount })),
      reset: () => set({
        isCreated: false,
        teamSelected: false,
        name: "VIRAJ SHARMA",
        role: "Batsman",
        battingStyle: "Right-Handed",
        bowlingStyle: "Fast",
        personality: "Aggressive",
        specialty: "",
        portraitIndex: 0,
        teamName: "Mumbai Titans",
        ovr: 68,
        level: 1,
        fans: 12500,
        xp: 0,
        xpToNext: 100,
        confidence: 78,
        fitness: 80,
        reputation: 30,
        totalMatches: 0,
        totalRuns: 0,
        totalWickets: 0,
        currentRival: "Arjun Patel",
        sponsorOffers: [],
        latestMatchResult: null
      }),

      // Sync state with backend profile
      loadPlayerFromBackend: async () => {
        try {
          const player = await api.getPlayer();
          if (player) {
            const thresholds = [0, 100, 250, 500, 900, 1500, 2300, 3300, 4600, 6200, 10000];
            const currentLevel = player.level;
            const xpForCurrentLevel = thresholds[currentLevel - 1] || 0;
            const xpRequiredForNextLevel = thresholds[currentLevel] || (currentLevel * 2000);
            
            // Calculate overall
            let baseBat = 65;
            let baseBowl = 65;
            if (player.role === "BATSMAN") baseBat = 75;
            else if (player.role === "BOWLER") baseBowl = 75;

            const calculatedOvr = Math.round(
              player.role === "BATSMAN"
                ? baseBat * 0.6 + player.confidence * 0.2 + player.fitness * 0.1 + player.reputation * 0.1
                : player.role === "BOWLER"
                ? baseBowl * 0.6 + player.confidence * 0.2 + player.fitness * 0.1 + player.reputation * 0.1
                : (baseBat + baseBowl) * 0.35 + player.confidence * 0.15 + player.fitness * 0.1 + player.reputation * 0.05
            );

            set({
              name: player.name,
              role: mapRoleToFrontend(player.role),
              battingStyle: mapBattingStyleToFrontend(player.battingStyle),
              bowlingStyle: mapBowlingStyleToFrontend(player.bowlingStyle),
              personality: mapPersonalityToFrontend(player.personality),
              specialty: mapSpecialtyToFrontend(player.specialty),
              level: player.level,
              xp: player.xp - xpForCurrentLevel,
              xpToNext: xpRequiredForNextLevel - xpForCurrentLevel,
              fans: player.followers,
              confidence: player.confidence,
              fitness: player.fitness,
              reputation: player.reputation,
              totalMatches: player.totalMatches,
              totalRuns: player.totalRuns,
              totalWickets: player.totalWickets,
              ovr: calculatedOvr,
              isCreated: true,
            });
          }
        } catch (err) {
          console.warn("Could not load player from backend:", (err as Error).message);
        }
      },

      // Create player profile on backend
      createPlayerOnBackend: async (formData) => {
        try {
          const payload = {
            name: formData.name,
            role: mapRoleToBackend(formData.role),
            battingStyle: mapBattingStyleToBackend(formData.battingStyle),
            bowlingStyle: mapBowlingStyleToBackend(formData.bowlingStyle),
            personality: mapPersonalityToBackend(formData.personality),
            specialty: mapSpecialtyToBackend(formData.specialty),
          };

          const player = await api.createPlayer(payload);
          if (player) {
            set({
              name: player.name,
              role: formData.role,
              battingStyle: formData.battingStyle,
              bowlingStyle: formData.bowlingStyle,
              personality: formData.personality,
              specialty: formData.specialty,
              portraitIndex: formData.portraitIndex,
              level: player.level,
              xp: player.xp,
              xpToNext: 100, // first level threshold
              fans: player.followers,
              confidence: player.confidence,
              fitness: player.fitness,
              reputation: player.reputation,
              totalMatches: player.totalMatches,
              totalRuns: player.totalRuns,
              totalWickets: player.totalWickets,
              isCreated: true,
            });
          }
        } catch (err) {
          console.error("Failed to create player on backend:", err);
          // Fallback to local state if server fails
          set({
            name: formData.name,
            role: formData.role,
            battingStyle: formData.battingStyle,
            bowlingStyle: formData.bowlingStyle,
            personality: formData.personality,
            specialty: formData.specialty,
            portraitIndex: formData.portraitIndex,
            isCreated: true,
          });
        }
      },

      // Simulate match and save results
      simulateMatchOnBackend: async (params) => {
        try {
          const result = await api.startMatch(params);
          if (result) {
            const player = result.updatedPlayer;
            const thresholds = [0, 100, 250, 500, 900, 1500, 2300, 3300, 4600, 6200, 10000];
            const currentLevel = player.level;
            const xpForCurrentLevel = thresholds[currentLevel - 1] || 0;
            const xpRequiredForNextLevel = thresholds[currentLevel] || (currentLevel * 2000);

            let baseBat = 65;
            let baseBowl = 65;
            if (player.role === "BATSMAN") baseBat = 75;
            else if (player.role === "BOWLER") baseBowl = 75;

            const calculatedOvr = Math.round(
              player.role === "BATSMAN"
                ? baseBat * 0.6 + player.confidence * 0.2 + player.fitness * 0.1 + player.reputation * 0.1
                : player.role === "BOWLER"
                ? baseBowl * 0.6 + player.confidence * 0.2 + player.fitness * 0.1 + player.reputation * 0.1
                : (baseBat + baseBowl) * 0.35 + player.confidence * 0.15 + player.fitness * 0.1 + player.reputation * 0.05
            );

            set({
              level: player.level,
              xp: player.xp - xpForCurrentLevel,
              xpToNext: xpRequiredForNextLevel - xpForCurrentLevel,
              fans: player.followers,
              confidence: player.confidence,
              fitness: player.fitness,
              reputation: player.reputation,
              totalMatches: player.totalMatches,
              totalRuns: player.totalRuns,
              totalWickets: player.totalWickets,
              ovr: calculatedOvr,
              sponsorOffers: result.sponsors || [],
              latestMatchResult: result,
            });
            return result;
          }
          throw new Error("Invalid match result returned");
        } catch (err) {
          console.error("Match simulation failed:", err);
          throw err;
        }
      },

      // Accept a sponsor offer
      acceptSponsorOffer: (id) => {
        set((state) => ({
          sponsorOffers: state.sponsorOffers.filter((o) => o.id !== id),
        }));
      },
    }),
    { name: "athlete-zero-player" }
  )
);

export function formatFans(fans: number): string {
  if (fans >= 1_000_000) return (fans / 1_000_000).toFixed(1) + "M";
  if (fans >= 1_000) return (fans / 1_000).toFixed(0) + "K";
  return fans.toString();
}
