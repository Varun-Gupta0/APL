"use client";

import { motion } from "framer-motion";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="bg-[#111E32] rounded-xl p-xs flex justify-between items-center shadow-sm border border-[#16233B] overflow-x-auto scrollbar-custom">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`relative px-md py-sm font-label-lg uppercase tracking-wider transition-colors ${
              isActive ? "text-[#D4AF37]" : "text-gray-400 hover:text-white"
            }`}
          >
            {category}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
