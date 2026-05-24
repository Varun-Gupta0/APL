import { useState, useEffect } from "react";
import { api, SocialFeedResponse } from "@/lib/api";

export function useSocial() {
  const [feedData, setFeedData] = useState<SocialFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      const data = await api.getSocialFeed(true, "mixed");
      setFeedData(data);
    } catch (err: any) {
      console.error("Failed to fetch social feed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return { feedData, isLoading, error, refreshFeed: fetchFeed };
}
