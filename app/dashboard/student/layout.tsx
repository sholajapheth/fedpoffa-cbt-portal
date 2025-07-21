"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
