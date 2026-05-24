"use client";

import { SocialFeed } from "@/components/social/SocialFeed";
import { TrendingPanel } from "@/components/social/TrendingPanel";
import { FanMeter } from "@/components/social/FanMeter";
import { AnalystCard } from "@/components/social/AnalystCard";
import { FeedPostProps } from "@/components/social/FeedPost";
import { PageTransition } from "@/components/shared/PageTransition";
import { SectionHeader } from "@/components/shared/SectionHeader";

const MOCK_POSTS: FeedPostProps[] = [
  {
    id: "p1",
    author: "CricAnalytics Pro",
    handle: "analytics_pro",
    timeAgo: "2h",
    content: (
      <>
        Is Sharma the greatest finisher of this era? The numbers don&apos;t lie. His strike rate in the final 4 overs is 214.3. Absolute dominance. <span className="text-[#D4AF37] font-bold">#AthleteZero #Cricket</span>
      </>
    ),
    avatar: "https://lh3.googleusercontent.com/aida/ADBb0uhajcPZG5jQ1NbAfWM_9vQr3aO3neQWBTJkxVykHDcaHAlvbYkgqfWkKufBrjK_HuUjwwLPjRKx9HSaWS73SlnmkJo285WfnlGyFxz5OH0S1Xcs13mc9xd5tM5SVUTfvLBOUNS2Thek3WsuXSUNpFMnRrAMSsQ_xafg7f0iKf9-43CFgn40rs7zAxHBP-dbLXd9Zpy3gYmHY9e5TrkO8suOH2yr-xPUnmrKra5485thFlmxGEEaLPZ7Xqc",
    isVerified: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5NPmJz9QRVS6jfW5fvAAvjprDNrX6XH0NhDJfuTTvJFeUun6-l4d_GOZEsvVNiMCERc3EvtF72DGA_KLdUttHI4Zl-a7LFwSvGeMrVvwT5hucgndXd21KPnYdZ5TjgVmQtJx_keFSaKln9-YuXGQac57YgilvUnrcPV17eJDZEaKIjv35bBq-meYo6UTVO--RGCZNoDdIE2i0ZUo9N5P7VZU0cGQO7Iio0CxI-rvWDKDqN1oAVvR_TSpVzLuFqUMJuEMLXcJ29l0",
    likes: 8900, comments: 1200, reposts: 450, category: "ANALYSTS",
  },
  {
    id: "p2",
    author: "Titans Captain",
    handle: "rival_captain",
    timeAgo: "5h",
    content: (
      <>The pressure is mounting. We&apos;re ready for the showdown on Sunday. 🏟️ <span className="text-[#D4AF37] font-bold">#TitansVsDynamos</span></>
    ),
    avatar: "https://lh3.googleusercontent.com/aida/ADBb0uinku_iZrXqbYYISPuPBmvdhpVhI3-bq6c4wjSUCHl-GfHf4OIYEfPloM6FdBRS3gIrRS2KRSm1lRB6oU3yhreFDGxroFLkxOpSpp124bB3ea0pYQ__ixcDsqCigJe7R97ajKf22OqbH6Ep8RpKX-l3bMvhZLHrhH5kZ1Ue-9c2xdjhxZFC6FWPLiYVmrs8u4BweADAR3_tiv3TVToZfM_-vCuvx6mz4xW-abfwjGhb118V0N91jOwG6ys",
    isVerified: true,
    likes: 312, comments: 82, reposts: 21, category: "RIVALS",
  },
  {
    id: "p3",
    author: "Athlete Zero News",
    handle: "zero_news",
    timeAgo: "8h",
    content: (<span className="font-semibold italic">EXCLUSIVE: Training camp footage leaked. The speed is unbelievable this season.</span>),
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzkEGmi0DBIQVeSscj9YvvQKNCTVI-dsErjIrvU4Fb259xRVtjfGas6ZqrKne7npBai5QbDFeExwCLFvqgENATEJWQjDmF9Rq-x4n2nVZeXE7pgWVMQ-WRyaK0lpfhPD_Ek8ZfiB7ewDltT-C52lyy1VYwP3Uw6kaDeMxVUuh1Haep5_mpuTXDXXWZe26B9rvmuJyE1eBdqa8_XrOZN0u-5a8S58AGBiv4BqLUM5M42vJUcIMJbWCYnOpYlKM-XpFIOCDyrEUNohg",
    isVerified: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEbMSOlw0VcvY492GGLkB68J_5mh3X3dpuQccC1jf10X9DCTCKG-bEhyRR3hPft7XveQzJs2yrpPYyt0RtSx041oX6LABo0i9ydec4ChPlrmkQICvjutHqajfBr-DOa1krDYJuvSp8Gx5MmCq6Ak1yhSuJV92_UQBpynleGCCmAjtOH856KlTnod7HptrH8RlzGJaytozLw72ih5bsrYdSHWX7nCk2hay3SpbHc_PcRMZLNfItXI846mRTRKDgHSBDw-oyQFz4Vq0",
    likes: 15000, comments: 3400, reposts: 1200, category: "MEDIA",
  },
  {
    id: "p4",
    author: "CricketLover99",
    handle: "fanboy101",
    timeAgo: "10m",
    content: "Just bought tickets for the finals! Can't wait to see Sharma destroy the Dynamos bowling attack! 🔥",
    avatar: "https://lh3.googleusercontent.com/aida/ADBb0uiXq6jPlK5ti63iPq6Uryfl1tMA7XH0k9GBpWsIF4TcVwyhdB66fPyRV5Uo-0M8hY2Gk77bA9fCWtLhoHzf2oCWNiolzK9GtDx_iIftjJAnx0s99lqpw5qT8m9TbQTri7tQijoazEQ9B3CktaGNrrRXQvm-40Giu1Hilyfyy8Czfm101TqgNvOvemoAgmCk5sPP_VlWUbDL8UcGy31D1VGxxLHTvqH1mQFd7ZLMKVfzsS7BgeXzVeV2L40",
    likes: 45, comments: 2, reposts: 0, category: "FANS",
  }
];

import { useSocial } from "@/hooks/useSocial";

export default function SocialDashboardPage() {
  const { feedData, isLoading, refreshFeed } = useSocial();

  if (isLoading && !feedData) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-6xl">
          <SectionHeader title="Social Feed" subtitle="The world is watching your rise" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
            <section className="lg:col-span-8 space-y-4">
               <div className="h-32 bg-[#16233B] w-full rounded-2xl mb-4" />
               <div className="h-32 bg-[#16233B] w-full rounded-2xl mb-4" />
               <div className="h-32 bg-[#16233B] w-full rounded-2xl mb-4" />
            </section>
            <aside className="lg:col-span-4 space-y-4">
               <div className="h-48 bg-[#16233B] w-full rounded-2xl mb-4" />
               <div className="h-64 bg-[#16233B] w-full rounded-2xl" />
            </aside>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Map backend posts to FeedPostProps format
  const mappedPosts: FeedPostProps[] = (feedData?.feed.posts || MOCK_POSTS).map((post: any) => ({
    id: post.id,
    author: post.author,
    handle: post.handle,
    timeAgo: "Just now",
    content: post.content,
    avatar: post.avatar.startsWith("http") ? post.avatar : undefined, // the backend uses emojis
    avatarEmoji: !post.avatar.startsWith("http") ? post.avatar : undefined,
    isVerified: post.isVerified,
    likes: post.likes,
    comments: post.replies,
    reposts: post.retweets,
    category: post.postType + "S",
  }));

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-end mb-6">
          <SectionHeader title="Social Feed" subtitle="The world is watching your rise" />
          <button 
            onClick={refreshFeed}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-[#16233B] px-4 py-2 text-xs font-bold text-gray-300 hover:bg-[#1f2f4e] transition-colors uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? "Refreshing..." : "Refresh Feed"}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <section className="lg:col-span-8 space-y-4">
            <SocialFeed initialPosts={mappedPosts} />
          </section>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <FanMeter approvalRating={feedData?.feed.sentimentScore || 88} />
            {/* Can pass dynamic trending hashtags to TrendingPanel if it accepts props */}
            <TrendingPanel />
            <AnalystCard />
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
