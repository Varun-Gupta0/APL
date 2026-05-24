import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { api, BackendPlayer } from "@/lib/api";

export function usePlayer() {
  const store = usePlayerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with backend on mount if not synced
  useEffect(() => {
    if (store.isCreated && !store.backendSynced) {
      const syncPlayer = async () => {
        try {
          setIsLoading(true);
          // 1. Try to get player from backend
          let backendPlayer: BackendPlayer | null = null;
          try {
            backendPlayer = await api.getPlayer();
          } catch (e) {
            // Player might not exist on backend yet
          }

          if (backendPlayer && !backendPlayer.id) {
             // Handle mock/demo player cases where id might be missing or not our player
             backendPlayer = null;
          }

          // 2. If no backend player, recreate it using store data
          if (!backendPlayer) {
            backendPlayer = await api.createPlayer({
              name: store.name,
              role: store.role.toUpperCase().replace("-", "_"),
              battingStyle: store.battingStyle.toUpperCase().replace("-", "_"),
              bowlingStyle: store.bowlingStyle.toUpperCase(),
              personality: store.personality.toUpperCase(),
              specialty: store.specialty.toUpperCase().replace(" ", "_") || "BIG_HITTER",
            });
          }

          // 3. Update store with backend data
          if (backendPlayer) {
             store.setPlayer({
               name: backendPlayer.name,
               level: backendPlayer.level,
               xp: backendPlayer.xp,
               fans: backendPlayer.followers,
               confidence: backendPlayer.confidence,
               ovr: Math.floor((backendPlayer.confidence + backendPlayer.fitness) / 2) || store.ovr,
             });
             store.setBackendSynced(true);
          }
        } catch (err: any) {
          setError(err.message || "Failed to sync player with backend");
          console.error("Backend sync error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      syncPlayer();
    }
  }, [store.isCreated, store.backendSynced]);

  return { player: store, isLoading, error };
}
