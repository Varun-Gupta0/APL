"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryTabs } from "./CategoryTabs";
import { FeedPost, FeedPostProps } from "./FeedPost";

const CATEGORIES = ["ALL", "FANS", "MEDIA", "ANALYSTS", "RIVALS"];

interface SocialFeedProps {
  initialPosts: FeedPostProps[];
}

export function SocialFeed({ initialPosts }: SocialFeedProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredPosts = initialPosts.filter((post) => 
    activeCategory === "ALL" ? true : post.category === activeCategory
  );

  return (
    <div className="space-y-md">
      <CategoryTabs 
        categories={CATEGORIES} 
        activeCategory={activeCategory} 
        onSelect={setActiveCategory} 
      />
      
      <div className="space-y-md pb-24 lg:pb-0">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <FeedPost {...post} />
            </motion.div>
          ))}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-gray-400 font-body-md"
            >
              No posts in this category right now.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
