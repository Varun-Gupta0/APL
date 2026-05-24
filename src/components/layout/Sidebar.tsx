"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { usePlayerStore } from "@/store/playerStore";
import {
  Home,
  User,
  Dumbbell,
  Calendar,
  BarChart2,
  MessageSquare,
  Briefcase,
  Trophy,
  Settings,
  Swords,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "My Career", href: "/dashboard/career", icon: User },
  { name: "Training", href: "/dashboard/training", icon: Dumbbell },
  { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { name: "Statistics", href: "/dashboard/statistics", icon: BarChart2 },
  { name: "Social Feed", href: "/dashboard/social", icon: MessageSquare },
  { name: "Rivals", href: "/dashboard/rival", icon: Swords },
  { name: "Sponsors", href: "/dashboard/sponsors", icon: Briefcase },
  { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { name = "VIRAJ SHARMA", teamName = "Mumbai Titans", level = 1 } = usePlayerStore();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#16233B] bg-[#0B1220]/95 backdrop-blur-md pt-20 flex flex-col transition-transform sm:translate-x-0">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1 font-medium">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center rounded-lg p-3 transition-colors ${
                    isActive
                      ? "bg-[#16233B] text-white"
                      : "text-gray-400 hover:bg-[#16233B]/50 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-border"
                      className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-[#D4A94D] shadow-[0_0_10px_rgba(212,169,77,0.5)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-[#D4A94D]" : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  />
                  <span className="ml-3 font-sans tracking-wide">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Player Identity Footer */}
      <div className="border-t border-[#16233B] p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[#D4A94D]/50">
            <img
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="truncate font-heading text-sm text-white">{name}</p>
            <p className="truncate text-xs text-[#D4A94D]">{teamName} · LVL {level}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
