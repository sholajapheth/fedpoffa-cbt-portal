"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthWithFeedback } from "@/hooks/use-stores";
import { Button } from "@/components/ui/button";
import { FedpoffaLogo } from "@/components/ui/fedpoffa-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Menu,
  X,
  Home,
  FileText,
  BarChart3,
  BookOpen,
  User,
  LogOut,
  Users,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthWithFeedback();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const getNavigationItems = () => {
    if (user?.role === "student") {
      return [
        { name: "Dashboard", href: "/dashboard/student", icon: Home },
        {
          name: "My Assessments",
          href: "/dashboard/student/assessments",
          icon: FileText,
        },
        {
          name: "Results",
          href: "/dashboard/student/results",
          icon: BarChart3,
        },
        { name: "Courses", href: "/dashboard/student/courses", icon: BookOpen },
        { name: "Profile", href: "/dashboard/student/profile", icon: User },
      ];
    } else if (user?.role === "lecturer") {
      return [
        { name: "Dashboard", href: "/dashboard/lecturer", icon: Home },
        {
          name: "My Assessments",
          href: "/dashboard/lecturer/assessments",
          icon: FileText,
        },
        {
          name: "Question Bank",
          href: "/dashboard/lecturer/questions",
          icon: BookOpen,
        },
        {
          name: "Grading",
          href: "/dashboard/lecturer/grading",
          icon: BarChart3,
        },
        { name: "Students", href: "/dashboard/lecturer/students", icon: Users },
        { name: "Profile", href: "/dashboard/lecturer/profile", icon: User },
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <FedpoffaLogo size="md" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">
                {user?.full_name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">
                {user?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Handle logout
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              router.push("/login");
            }}
            className="w-full"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={20} />
            </Button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome to FEDPOFFA CBT Portal, {user?.full_name || "User"}
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 bg-background">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden">
        <div className="flex justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex flex-col items-center py-2 px-3 text-muted-foreground hover:text-accent-foreground transition-colors"
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
