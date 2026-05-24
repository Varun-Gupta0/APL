"use client";

import Image from "next/image";
import { EngagementBar } from "./EngagementBar";

export interface FeedPostProps {
  id: string;
  author: string;
  handle: string;
  timeAgo: string;
  content: React.ReactNode;
  avatar: string;
  isVerified?: boolean;
  image?: string;
  likes: number;
  comments: number;
  reposts: number;
  category: "FANS" | "MEDIA" | "ANALYSTS" | "RIVALS";
}

export function FeedPost({
  author,
  handle,
  timeAgo,
  content,
  avatar,
  isVerified,
  image,
  likes,
  comments,
  reposts,
}: FeedPostProps) {
  return (
    <article className="bg-[#111E32] p-md rounded-xl shadow-sm border border-[#16233B] transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex gap-sm">
        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[#16233B] ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#111E32]">
          <Image src={avatar} alt={author} width={48} height={48} className="w-full h-full object-cover" unoptimized />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-xs">
                <h4 className="font-headline-sm text-white italic">{author}</h4>
                {isVerified && (
                  <span className="material-symbols-outlined text-[#D4AF37] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                )}
              </div>
              <p className="font-body-sm text-gray-400">@{handle} • {timeAgo}</p>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          
          <div className="mt-sm space-y-sm">
            <div className="font-body-md text-white">
              {content}
            </div>
            
            {image && (
              <div className="rounded-lg overflow-hidden border border-[#16233B]">
                <Image src={image} alt="Post attachment" width={600} height={256} className="w-full h-64 object-cover" unoptimized />
              </div>
            )}
          </div>
          
          <EngagementBar initialLikes={likes} initialComments={comments} initialReposts={reposts} />
        </div>
      </div>
    </article>
  );
}
