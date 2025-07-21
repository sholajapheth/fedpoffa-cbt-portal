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
  FileText,
  Clock,
  CheckCircle,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAuthWithFeedback } from "@/hooks/use-stores";
import { useUserProfile } from "@/lib/api/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthWithFeedback();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  console.log(profile);
  console.log(user);
  console.log(isAuthenticated);
  console.log(isLoading);

  // Role-based access control
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Ensure user is a student
      if (user.role !== "student") {
        // Redirect to appropriate dashboard based on role
        if (user.role === "lecturer") {
          router.push("/dashboard/lecturer");
        } else if (user.role === "admin") {
          router.push("/dashboard/admin");
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fedpoffa-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const stats = [
    {
      title: "Pending Assessments",
      value: "3",
      description: "Due this week",
      icon: Clock,
      color: "text-fedpoffa-orange",
    },
    {
      title: "Completed Tests",
      value: "12",
      description: "This semester",
      icon: CheckCircle,
      color: "text-fedpoffa-green",
    },
    {
      title: "Recent Results",
      value: "2",
      description: "Available to view",
      icon: TrendingUp,
      color: "text-fedpoffa-purple",
    },
    {
      title: "Current GPA",
      value: "3.45",
      description: "This semester",
      icon: Award,
      color: "text-fedpoffa-green",
    },
  ];

  const recentAssessments = [
    {
      id: 1,
      title: "Petroleum Geology Quiz",
      course: "PET 201",
      type: "Quiz",
      dueDate: "2024-01-20",
      status: "pending",
      duration: "30 mins",
    },
    {
      id: 2,
      title: "Drilling Engineering Assignment",
      course: "PET 301",
      type: "Assignment",
      dueDate: "2024-01-22",
      status: "pending",
      duration: "2 hours",
    },
    {
      id: 3,
      title: "Reservoir Engineering Test",
      course: "PET 302",
      type: "Test",
      dueDate: "2024-01-18",
      status: "completed",
      duration: "1 hour",
    },
  ];

  const courses = [
    { code: "PET 201", name: "Petroleum Geology", assessments: 3 },
    { code: "PET 301", name: "Drilling Engineering", assessments: 2 },
    { code: "PET 302", name: "Reservoir Engineering", assessments: 4 },
    { code: "GNS 201", name: "Nigerian Peoples and Culture", assessments: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2 text-foreground">
          Welcome back, {user?.full_name || "Student"}!
        </h1>
        <p className="text-muted-foreground">
          Federal Polytechnic Offa - Student Dashboard
        </p>
        {/* {user && (
          <p className="text-muted-foreground text-sm mt-2">
            {user.department_name} • Level {user.level} • {user.matric_number}
          </p>
        )} */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Assessments
            </CardTitle>
            <CardDescription>
              Your upcoming and recent assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {assessment.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {assessment.course} • {assessment.duration}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {assessment.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        assessment.status === "pending"
                          ? "destructive"
                          : "default"
                      }
                      className={
                        assessment.status === "pending"
                          ? "bg-fedpoffa-orange"
                          : "bg-fedpoffa-green"
                      }
                    >
                      {assessment.status}
                    </Badge>
                    {assessment.status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-fedpoffa-purple hover:bg-fedpoffa-purple/90"
                      >
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Assessments
            </Button>
          </CardContent>
        </Card>

        {/* Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>
              Courses you are enrolled in this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{course.code}</h4>
                    <p className="text-sm text-gray-600">{course.name}</p>
                  </div>
                  <Badge variant="secondary">
                    {course.assessments} assessments
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View All Courses
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Academic Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Academic Calendar
          </CardTitle>
          <CardDescription>Important dates and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-fedpoffa-purple/10 rounded-lg">
              <h4 className="font-medium text-fedpoffa-purple">
                Current Semester
              </h4>
              <p className="text-sm text-gray-600">2023/2024 Second Semester</p>
              <p className="text-xs text-gray-500">Jan 15 - Jun 30, 2024</p>
            </div>
            <div className="p-4 bg-fedpoffa-orange/10 rounded-lg">
              <h4 className="font-medium text-fedpoffa-orange">
                Mid-Semester Break
              </h4>
              <p className="text-sm text-gray-600">March 25 - April 1</p>
              <p className="text-xs text-gray-500">1 week break</p>
            </div>
            <div className="p-4 bg-fedpoffa-green/10 rounded-lg">
              <h4 className="font-medium text-fedpoffa-green">Final Exams</h4>
              <p className="text-sm text-gray-600">June 1 - June 15</p>
              <p className="text-xs text-gray-500">2 weeks duration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
