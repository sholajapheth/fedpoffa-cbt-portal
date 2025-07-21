"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
