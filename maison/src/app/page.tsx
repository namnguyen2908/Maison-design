"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAxios } from "@/hooks/use-axios";
import type { SafeUser } from "@/hooks/use-axios";

export default function HomePage() {
  const router = useRouter();
  const { data, error } = useAxios<SafeUser>("/api/auth/me");

  useEffect(() => {
    if (data) router.replace("/dashboard");
  }, [data, router]);

  useEffect(() => {
    if (error) router.replace("/login");
  }, [error, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex items-center gap-3 text-sm text-secondary">
        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Đang tải...
      </div>
    </div>
  );
}