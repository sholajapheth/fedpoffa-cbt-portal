"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthWithFeedback } from "@/hooks/use-stores";
import { useMyEnrolledCourses } from "@/lib/api/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Search,
  Filter,
  Calendar,
  User,
  BarChart3,
} from "lucide-react";

export default function StudentCourses() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthWithFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

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

  // Get enrolled courses
  const { data: coursesData, isLoading: coursesLoading } = useMyEnrolledCourses(
    {
      status_filter: statusFilter || undefined,
    }
  );

  // Filter courses based on search term
  const filteredCourses =
    coursesData?.courses?.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Show loading state
  if (isLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fedpoffa-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "enrolled":
        return "bg-fedpoffa-green text-white";
      case "completed":
        return "bg-fedpoffa-purple text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "dropped":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getGradeColor = (grade: string) => {
    const gradeValue = parseFloat(grade);
    if (gradeValue >= 70) return "text-fedpoffa-green";
    if (gradeValue >= 60) return "text-fedpoffa-orange";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-fedpoffa-purple to-fedpoffa-orange rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">My Courses</h1>
        <p className="text-white/90">View and manage your enrolled courses</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fedpoffa-purple"
          >
            <option value="">All Status</option>
            <option value="enrolled">Enrolled</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="dropped">Dropped</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {coursesData?.total || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-fedpoffa-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-fedpoffa-green">
                  {
                    filteredCourses.filter(
                      (c) => c.enrollment_status === "completed"
                    ).length
                  }
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-fedpoffa-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current GPA</p>
                <p className="text-2xl font-bold text-fedpoffa-orange">
                  {filteredCourses.length > 0
                    ? (
                        filteredCourses.reduce(
                          (sum, c) => sum + (c.gpa_points || 0),
                          0
                        ) / filteredCourses.length
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-fedpoffa-orange" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-fedpoffa-purple">
                  {
                    filteredCourses.filter(
                      (c) => c.enrollment_status === "enrolled"
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-fedpoffa-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {course.code} • {course.department_name}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(course.enrollment_status)}>
                  {course.enrollment_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{course.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Credits</p>
                  <p className="font-medium">{course.credits}</p>
                </div>
                <div>
                  <p className="text-gray-500">Level</p>
                  <p className="font-medium">{course.level}</p>
                </div>
                <div>
                  <p className="text-gray-500">Semester</p>
                  <p className="font-medium">{course.semester_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Coordinator</p>
                  <p className="font-medium">{course.coordinator_name}</p>
                </div>
              </div>

              {course.final_grade && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Final Grade</p>
                      <p
                        className={`text-lg font-bold ${getGradeColor(
                          course.final_grade
                        )}`}
                      >
                        {course.final_grade} ({course.final_score}%)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">GPA Points</p>
                      <p className="text-lg font-bold">{course.gpa_points}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(course.enrollment_date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    {course.total_assessments} assessments
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && !coursesLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter
                ? "Try adjusting your search or filter criteria."
                : "You haven't enrolled in any courses yet."}
            </p>
            <Button className="bg-fedpoffa-purple hover:bg-fedpoffa-purple/90">
              Browse Available Courses
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
