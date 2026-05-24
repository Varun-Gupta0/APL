"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  // Match State
  currentRival: string | null;

  // Career Status
  isCreated: boolean;
  teamSelected: boolean;
  backendSynced: boolean;

  // Backend Data
  sponsors: any[];
  rivals: any[];

  // Actions
  setPlayer: (data: Partial<Omit<PlayerState, "setPlayer" | "addXp" | "addFans" | "setTeam" | "reset">>) => void;
  setTeam: (teamName: string) => void;
  addXp: (amount: number) => void;
  addFans: (amount: number) => void;
  setSponsors: (sponsors: any[]) => void;
  setRivals: (rivals: any[]) => void;
  setBackendSynced: (synced: boolean) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
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
      level: 4,
      fans: 125000,
      xp: 3400,
      xpToNext: 5000,
      confidence: 78,

      currentRival: "Arjun Patel",

      isCreated: false,
      teamSelected: false,
      backendSynced: false,
      sponsors: [],
      rivals: [],

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
      setSponsors: (sponsors) => set({ sponsors }),
      setRivals: (rivals) => set({ rivals }),
      setBackendSynced: (synced) => set({ backendSynced: synced }),
      reset: () => set({ isCreated: false, teamSelected: false, backendSynced: false, ovr: 68, level: 4, fans: 125000, xp: 3400, sponsors: [], rivals: [] }),
    }),
    { name: "athlete-zero-player" }
  )
);

export function formatFans(fans: number): string {
  if (fans >= 1_000_000) return (fans / 1_000_000).toFixed(1) + "M";
  if (fans >= 1_000) return (fans / 1_000).toFixed(0) + "K";
  return fans.toString();
}
