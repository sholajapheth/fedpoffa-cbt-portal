"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface LecturerLayoutProps {
  children: React.ReactNode;
}

export default function LecturerLayout({ children }: LecturerLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
