import { create } from "zustand";
import type { MatchSimulationResult } from "@/lib/api";

export interface MatchState {
  matchResult: MatchSimulationResult | null;
  isLoading: boolean;
  step: "PRE_MATCH" | "SIMULATION" | "SUMMARY";
  
  setMatchResult: (result: MatchSimulationResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setStep: (step: "PRE_MATCH" | "SIMULATION" | "SUMMARY") => void;
  reset: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  matchResult: null,
  isLoading: false,
  step: "PRE_MATCH",

  setMatchResult: (result) => set({ matchResult: result }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setStep: (step) => set({ step }),
  reset: () => set({ matchResult: null, isLoading: false, step: "PRE_MATCH" }),
}));
