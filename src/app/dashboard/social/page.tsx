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

export default function SocialDashboardPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Social Feed" subtitle="The world is watching your rise" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <section className="lg:col-span-8 space-y-4">
            <SocialFeed initialPosts={MOCK_POSTS} />
          </section>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <FanMeter approvalRating={88} />
            <TrendingPanel />
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
