import { useState, useEffect } from "react";
import { api, RivalProfile } from "@/lib/api";

const mapBackendRivalToProfile = (backendRival: any): RivalProfile => {
  if (!backendRival) return null as any;

  let team = "Opposition";
  let role = "Batsman";
  let ovr = 80;

  const name = backendRival.name || "";
  if (name.includes("Karan")) {
    team = "Royal Challengers Bangalore";
    role = "Top-Order Batter";
    ovr = 88;
  } else if (name.includes("Arjun")) {
    team = "Chennai Super Kings";
    role = "All-Rounder";
    ovr = 92;
  } else if (name.includes("Vikram")) {
    team = "Kolkata Knight Riders";
    role = "Wicketkeeper-Batter";
    ovr = 81;
  } else if (name.includes("Dev")) {
    team = "Delhi Capitals";
    role = "Fast Bowler";
    ovr = 76;
  }

  return {
    id: backendRival.id,
    name: backendRival.name,
    team: backendRival.team || team,
    role: backendRival.role || role,
    personality: backendRival.personality,
    avatar: backendRival.avatar || backendRival.avatarEmoji || "🔥",
    ovr: backendRival.ovr || ovr,
    tension: backendRival.tension || backendRival.intensityScore || 50,
    status: backendRival.status || "ACTIVE",
    history: backendRival.history || {
      matchesPlayed: 3,
      playerWins: 1,
      rivalWins: 2,
      lastMatchResult: "Lost by 15 runs"
    },
    dialogue: backendRival.dialogue || (backendRival.trashTalk ? backendRival.trashTalk[0] : undefined)
  };
};

export function useRival() {
  const [rivals, setRivals] = useState<RivalProfile[]>([]);
  const [activeRival, setActiveRival] = useState<RivalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRivals = async () => {
    try {
      setIsLoading(true);
      const data = await api.getRivals();
      setRivals((data || []).map(mapBackendRivalToProfile));
    } catch (err: any) {
      console.error("Failed to fetch rivals:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadRival = async () => {
       try {
         setIsLoading(true);
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001"}/api/rival`);
         const json = await res.json();
         if (json.data && json.data.rival) {
             setActiveRival(mapBackendRivalToProfile(json.data.rival));
         }
       } catch (e) {
           console.error(e);
       } finally {
           setIsLoading(false);
       }
    };
    loadRival();
  }, []);

  return { rivals, activeRival, isLoading, error, refreshRivals: fetchRivals };
}

