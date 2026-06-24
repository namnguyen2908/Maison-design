"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../layout";

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalClients: 0,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Tổng quan</h1>
        <p className="mt-1 text-sm text-secondary">Chào mừng, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Tổng dự án</p>
              <p className="mt-1 text-3xl font-semibold text-text">{stats.totalProjects}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Đang thực hiện</p>
              <p className="mt-1 text-3xl font-semibold text-text">{stats.activeProjects}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Hoàn thành</p>
              <p className="mt-1 text-3xl font-semibold text-text">{stats.completedProjects}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary">Khách hàng</p>
              <p className="mt-1 text-3xl font-semibold text-text">{stats.totalClients}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
              <svg className="h-6 w-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}