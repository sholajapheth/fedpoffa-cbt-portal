"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { FedpoffaLogo } from "@/components/ui/fedpoffa-logo"
import { Menu, X, Home, FileText, BarChart3, BookOpen, User, LogOut, Users } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const getNavigationItems = () => {
    if (user?.role === "student") {
      return [
        { name: "Dashboard", href: "/dashboard/student", icon: Home },
        { name: "My Assessments", href: "/dashboard/student/assessments", icon: FileText },
        { name: "Results", href: "/dashboard/student/results", icon: BarChart3 },
        { name: "Courses", href: "/dashboard/student/courses", icon: BookOpen },
        { name: "Profile", href: "/dashboard/student/profile", icon: User },
      ]
    } else if (user?.role === "lecturer") {
      return [
        { name: "Dashboard", href: "/dashboard/lecturer", icon: Home },
        { name: "My Assessments", href: "/dashboard/lecturer/assessments", icon: FileText },
        { name: "Question Bank", href: "/dashboard/lecturer/questions", icon: BookOpen },
        { name: "Grading", href: "/dashboard/lecturer/grading", icon: BarChart3 },
        { name: "Students", href: "/dashboard/lecturer/students", icon: Users },
        { name: "Profile", href: "/dashboard/lecturer/profile", icon: User },
      ]
    }
    return []
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <FedpoffaLogo size="md" />
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-fedpoffa-purple/10 hover:text-fedpoffa-purple transition-colors"
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-fedpoffa-purple rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">{user?.name.charAt(0)}</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full bg-transparent">
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={20} />
            </Button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome to FEDPOFFA CBT Portal, {user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-fedpoffa-purple"
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
