"use client";

export function TrendingPanel() {
  const trends = [
    { category: "Sports • Trending", hashtag: "#CricketSeason01", count: "42.5K" },
    { category: "Athletes", hashtag: "#TheFinisher", count: "18.2K" },
    { category: "League Action", hashtag: "#TitansVsDynamos", count: "9.1K" },
  ];

  return (
    <div className="bg-[#111E32] rounded-xl p-md shadow-sm border border-[#16233B]">
      <h3 className="font-headline-sm text-white italic mb-md">TRENDING FOR YOU</h3>
      <div className="space-y-md">
        {trends.map((trend, idx) => (
          <div key={idx} className="cursor-pointer hover:bg-[#16233B] p-xs rounded transition-colors -mx-xs px-xs">
            <p className="font-label-sm text-gray-400 uppercase tracking-tighter">{trend.category}</p>
            <p className="font-bold font-body-md text-white">{trend.hashtag}</p>
            <p className="font-label-sm text-gray-400">{trend.count} Posts</p>
          </div>
        ))}
      </div>
      <button className="mt-md w-full text-[#D4AF37] font-bold uppercase font-label-sm hover:underline">
        Show more
      </button>
    </div>
  );
}
