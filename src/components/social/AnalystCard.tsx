"use client";

import { motion } from "framer-motion";

export function AnalystCard() {
  return (
    <div className="bg-[#111E32] rounded-xl p-md shadow-sm border border-[#16233B]">
      <h3 className="font-headline-sm text-white italic mb-md">SENTIMENT ANALYSIS</h3>
      <div className="space-y-sm">
        <div className="flex justify-between items-end gap-base h-24">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "75%" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full bg-green-500 rounded-t-sm" 
          />
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "15%" }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full bg-red-400 rounded-t-sm" 
          />
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "10%" }}
            transition={{ duration: 1, delay: 0.6 }}
            className="w-full bg-gray-500 rounded-t-sm" 
          />
        </div>
        <div className="flex justify-between text-label-sm font-bold pt-xs uppercase tracking-tighter">
          <span className="text-green-500">Positive</span>
          <span className="text-red-400">Negative</span>
          <span className="text-gray-400">Neutral</span>
        </div>
        <p className="font-body-sm text-gray-400 mt-sm">
          Fan response is overwhelmingly positive after your last performance.
        </p>
      </div>
    </div>
  );
}
