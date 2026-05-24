"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface EngagementBarProps {
  initialLikes: number;
  initialComments: number;
  initialReposts: number;
}

export function EngagementBar({ initialLikes, initialComments, initialReposts }: EngagementBarProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const [reposts, setReposts] = useState(initialReposts);
  const [isReposted, setIsReposted] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setReposts((prev) => (isReposted ? prev - 1 : prev + 1));
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div className="mt-md flex justify-between items-center pt-sm border-t border-[#16233B] text-gray-400">
      <button className="flex items-center gap-xs hover:text-white transition-colors group">
        <motion.span whileHover={{ scale: 1.1 }} className="material-symbols-outlined">
          chat_bubble_outline
        </motion.span>
        <span className="font-label-sm text-label-sm">{formatCount(initialComments)}</span>
      </button>

      <button onClick={handleRepost} className={`flex items-center gap-xs transition-colors group ${isReposted ? "text-green-500" : "hover:text-green-500"}`}>
        <motion.span whileHover={{ scale: 1.1 }} className="material-symbols-outlined">
          repeat
        </motion.span>
        <span className="font-label-sm text-label-sm">{formatCount(reposts)}</span>
      </button>

      <button onClick={handleLike} className={`flex items-center gap-xs transition-colors group ${isLiked ? "text-red-500" : "hover:text-red-500"}`}>
        <motion.span whileHover={{ scale: 1.1 }} className="material-symbols-outlined" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
          favorite
        </motion.span>
        <span className="font-label-sm text-label-sm">{formatCount(likes)}</span>
      </button>

      <button className="hover:text-white transition-colors">
        <span className="material-symbols-outlined">share</span>
      </button>
    </div>
  );
}
