"use client";

import { useEffect, useState } from "react";
import { SocialFeed } from "@/components/social/SocialFeed";
import { TrendingPanel } from "@/components/social/TrendingPanel";
import { FanMeter } from "@/components/social/FanMeter";
import { AnalystCard } from "@/components/social/AnalystCard";
import { FeedPostProps } from "@/components/social/FeedPost";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { api, SocialPost } from "@/lib/api";
import { usePlayerStore } from "@/store/playerStore";

export default function SocialDashboardPage() {
  const { name } = usePlayerStore();
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [buzz, setBuzz] = useState<number>(125000);
  const [sentimentScore, setSentimentScore] = useState<number>(75);
  const [loading, setLoading] = useState(true);
  const [useAI, setUseAI] = useState(true);

  const fetchFeed = async (aiMode: boolean) => {
    setLoading(true);
    try {
      const data = await api.getSocialFeed(aiMode);
      if (data && data.feed) {
        const avatarMap: Record<string, string> = {
          FAN: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100",
          MEDIA: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=100",
          ANALYST: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
          RIVAL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          COACH: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
          MEME: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100",
        };

        const categoryMap: Record<string, "FANS" | "MEDIA" | "ANALYSTS" | "RIVALS"> = {
          FAN: "FANS",
          MEME: "FANS",
          MEDIA: "MEDIA",
          ANALYST: "ANALYSTS",
          COACH: "ANALYSTS",
          RIVAL: "RIVALS",
        };

        const mapped = data.feed.posts.map((post: SocialPost): FeedPostProps => {
          return {
            id: post.id,
            author: post.author,
            handle: post.handle,
            timeAgo: "Just Now",
            content: post.content,
            avatar: avatarMap[post.postType] || avatarMap.FAN,
            isVerified: post.isVerified,
            likes: post.likes || 0,
            comments: post.replies || 0,
            reposts: post.retweets || 0,
            category: categoryMap[post.postType] || "FANS",
          };
        });

        setPosts(mapped);
        setTrending(data.feed.trendingHashtags || []);
        setBuzz(data.feed.totalBuzz || 125000);
        setSentimentScore(data.feed.sentimentScore || 75);
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(useAI);
  }, [useAI]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <SectionHeader title="Social Feed" subtitle="The world is watching your rise" />
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-gray-400 tracking-wider">AI GEN</span>
            <button
              onClick={() => setUseAI(!useAI)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useAI ? "bg-[#D4AF37]" : "bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                  useAI ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <section className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#111E32]/40 rounded-xl border border-[#16233B]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D4A94D] border-t-transparent" />
                <p className="animate-pulse font-heading text-sm text-white uppercase tracking-wider">
                  {useAI ? "Gemini is writing the buzz..." : "Loading Social Feed..."}
                </p>
              </div>
            ) : (
              <SocialFeed initialPosts={posts} />
            )}
          </section>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <FanMeter approvalRating={sentimentScore} />
            
            {/* Custom Dynamic Trending Panel */}
            <div className="bg-[#111E32] p-6 rounded-xl border border-[#16233B]">
              <h3 className="mb-4 font-sans text-xs font-bold tracking-widest text-gray-400 uppercase">
                Trending #Zero Hype
              </h3>
              <div className="space-y-4">
                {trending.length > 0 ? (
                  trending.map((trend, i) => (
                    <div key={trend.tag} className="flex justify-between items-center">
                      <div>
                        <p className="font-heading text-base text-white">{trend.tag}</p>
                        <p className="text-xs text-gray-400 font-sans">
                          {(trend.count / 1000).toFixed(0)}K posts
                        </p>
                      </div>
                      <span className={`rounded-sm px-2 py-0.5 text-[10px] font-bold ${
                        trend.trend === "VIRAL"
                          ? "bg-red-500/20 text-red-400"
                          : trend.trend === "RISING"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {trend.trend}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No active hashtags</p>
                )}
              </div>
            </div>

            <AnalystCard />
            <button className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest italic">
              Upgrade to ELITE+
            </button>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
