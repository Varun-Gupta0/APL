"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/store/playerStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isCreated, teamSelected } = usePlayerStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (usePlayerStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = usePlayerStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      if (!isCreated) {
        router.replace("/create-player");
      } else if (!teamSelected) {
        router.replace("/team-select");
      }
    }
  }, [hydrated, isCreated, teamSelected, router]);

  if (!hydrated || !isCreated || !teamSelected) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4A94D] border-t-transparent" />
          <p className="font-heading text-lg tracking-wider text-white uppercase animate-pulse">
            LOADING CAREER...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <TopHeader />
      <Sidebar />
      {/* Main Content Area — padded to account for fixed header (h-20) and sidebar (w-64) */}
      <main className="pt-20 lg:pl-64 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
