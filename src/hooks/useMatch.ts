import { useMatchStore } from "@/store/matchStore";
import { usePlayerStore } from "@/store/playerStore";
import { api } from "@/lib/api";

export function useMatch() {
  const store = useMatchStore();
  const playerStore = usePlayerStore();

  const startMatch = async (params: { opponentName?: string; venue?: string; matchType?: string } = {}) => {
    try {
      store.setIsLoading(true);
      
      const result = await api.startMatch({
        opponentName: params.opponentName || "Chennai Champions",
        opponentDifficulty: 5,
        rivalryIntensity: 50,
        venue: params.venue || "Wankhede Stadium, Mumbai",
        matchType: params.matchType || "T20",
      });

      store.setMatchResult(result);
      
      // Update player store with post-match stats
      if (result.updatedPlayer) {
        playerStore.setPlayer({
          level: result.updatedPlayer.level,
          xp: result.updatedPlayer.xp,
          fans: result.updatedPlayer.followers,
          confidence: result.updatedPlayer.confidence,
        });
      }

      if (result.sponsors && result.sponsors.length > 0) {
        playerStore.setSponsors(result.sponsors);
      }

    } catch (error) {
      console.error("Match simulation failed", error);
      // Fallback or show error toast
    } finally {
      store.setIsLoading(false);
    }
  };

  return {
    ...store,
    startMatch,
  };
}
