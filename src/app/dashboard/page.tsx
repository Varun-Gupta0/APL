"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/home");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4A94D] border-t-transparent" />
    </div>
  );
}
