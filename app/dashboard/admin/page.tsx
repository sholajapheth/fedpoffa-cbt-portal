"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  BarChart3,
  AlertTriangle,
  Shield,
  Activity,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Database,
  Server,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAuthWithFeedback } from "@/hooks/use-stores";
import { useUserProfile } from "@/lib/api/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthWithFeedback();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Role-based access control
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Ensure user is an admin
      if (user.role !== "admin") {
        // Redirect to appropriate dashboard based on role
        if (user.role === "student") {
          router.push("/dashboard/student");
        } else if (user.role === "lecturer") {
          router.push("/dashboard/lecturer");
        } else {
          router.push("/auth/login");
        }
      }
    } else if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading state
  if (isLoading || profileLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fedpoffa-purple mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const systemStats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-fedpoffa-purple",
    },
    {
      title: "Active Courses",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: BookOpen,
      color: "text-fedpoffa-green",
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "0.1%",
      trend: "down",
      icon: Server,
      color: "text-fedpoffa-orange",
    },
    {
      title: "Storage Used",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Database,
      color: "text-red-500",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New user registered",
      user: "John Doe",
      role: "Student",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      action: "Course created",
      user: "Dr. Smith",
      role: "Lecturer",
      time: "15 minutes ago",
      status: "success",
    },
    {
      id: 3,
      action: "System backup completed",
      user: "System",
      role: "Admin",
      time: "1 hour ago",
      status: "success",
    },
    {
      id: 4,
      action: "Failed login attempt",
      user: "Unknown",
      role: "Unknown",
      time: "2 hours ago",
      status: "warning",
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: "Course Creation",
      title: "Advanced Petroleum Engineering",
      requester: "Dr. Johnson",
      department: "Petroleum Engineering",
      submitted: "2024-01-20",
    },
    {
      id: 2,
      type: "User Registration",
      title: "Lecturer Account",
      requester: "Dr. Williams",
      department: "Chemical Engineering",
      submitted: "2024-01-19",
    },
    {
      id: 3,
      type: "System Access",
      title: "Admin Privileges",
      requester: "IT Department",
      department: "Information Technology",
      submitted: "2024-01-18",
    },
  ];

  const userStats = [
    {
      role: "Students",
      count: 2456,
      active: 2341,
      inactive: 115,
      percentage: 95.3,
    },
    {
      role: "Lecturers",
      count: 234,
      active: 228,
      inactive: 6,
      percentage: 97.4,
    },
    {
      role: "Administrators",
      count: 12,
      active: 12,
      inactive: 0,
      percentage: 100,
    },
  ];

  const systemHealth = [
    {
      component: "Database",
      status: "healthy",
      uptime: "99.9%",
      response: "45ms",
    },
    {
      component: "API Server",
      status: "healthy",
      uptime: "99.8%",
      response: "120ms",
    },
    {
      component: "File Storage",
      status: "warning",
      uptime: "98.5%",
      response: "200ms",
    },
    {
      component: "Email Service",
      status: "healthy",
      uptime: "99.7%",
      response: "80ms",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2 text-foreground">
          Welcome back, {user?.full_name || "Administrator"}!
        </h1>
        <p className="text-muted-foreground">
          Federal Polytechnic Offa - System Administration Dashboard
        </p>
        {user && (
          <p className="text-muted-foreground text-sm mt-2">
            {user.department_name} • {user.role} • {user.id}
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="h-16 bg-fedpoffa-purple hover:bg-fedpoffa-purple/90">
          <Plus className="mr-2 h-5 w-5" />
          Add User
        </Button>
        <Button className="h-16 bg-fedpoffa-green hover:bg-fedpoffa-green/90">
          <BookOpen className="mr-2 h-5 w-5" />
          Create Course
        </Button>
        <Button className="h-16 bg-fedpoffa-orange hover:bg-fedpoffa-orange/90">
          <Settings className="mr-2 h-5 w-5" />
          System Settings
        </Button>
        <Button className="h-16 bg-gray-600 hover:bg-gray-700">
          <Database className="mr-2 h-5 w-5" />
          Backup System
        </Button>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest system activities and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.user} • {activity.role}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <Badge
                      variant={
                        activity.status === "success"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        activity.status === "success"
                          ? "bg-fedpoffa-green"
                          : "bg-yellow-500"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Activities
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-fedpoffa-orange" />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              Requests awaiting administrative approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="p-3 border rounded-lg bg-fedpoffa-orange/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {approval.title}
                    </h4>
                    <Badge variant="secondary">{approval.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {approval.requester} • {approval.department}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted: {approval.submitted}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="bg-fedpoffa-green hover:bg-fedpoffa-green/90"
                    >
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Pending
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Statistics
          </CardTitle>
          <CardDescription>
            Overview of user accounts and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userStats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.role}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{stat.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active:</span>
                    <span className="font-medium text-green-600">
                      {stat.active}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Inactive:</span>
                    <span className="font-medium text-red-600">
                      {stat.inactive}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Active Rate</span>
                      <span>{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-fedpoffa-green h-2 rounded-full"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>Real-time system component status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemHealth.map((component, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    {component.component}
                  </h4>
                  <Badge
                    variant={
                      component.status === "healthy"
                        ? "default"
                        : component.status === "warning"
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      component.status === "healthy"
                        ? "bg-fedpoffa-green"
                        : component.status === "warning"
                        ? "bg-fedpoffa-orange"
                        : "bg-gray-500"
                    }
                  >
                    {component.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium">{component.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response:</span>
                    <span className="font-medium">{component.response}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <Button variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
            <Button variant="outline" className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              size="sm"
              className="w-full bg-fedpoffa-purple hover:bg-fedpoffa-purple/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              View All Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Course Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              size="sm"
              className="w-full bg-fedpoffa-green hover:bg-fedpoffa-green/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Manage Courses
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">System Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              size="sm"
              className="w-full bg-fedpoffa-orange hover:bg-fedpoffa-orange/90"
            >
              <Database className="mr-2 h-4 w-4" />
              Backup
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button size="sm" className="w-full bg-gray-600 hover:bg-gray-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
