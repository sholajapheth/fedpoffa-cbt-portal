"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthWithFeedback } from "@/hooks/use-stores";
import {
  useCourses,
  useCourseStats,
  useCreateCourse,
  useDeleteCourse,
} from "@/lib/api/courses";
import { CourseDetailsDialog } from "@/components/courses/course-details-dialog";
import { CourseCreateModal } from "@/components/courses/course-create-modal";
import { CourseEditModal } from "@/components/courses/course-edit-modal";
import { DepartmentDropdown } from "@/components/ui/department-dropdown";
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
  Users,
  FileText,
  Search,
  Filter,
  Plus,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminCourses() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthWithFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

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

  // Get all courses
  const { data: coursesData, isLoading: coursesLoading } = useCourses({
    department_id: departmentFilter || undefined,
    active_only: activeOnly,
    available_only: availableOnly,
  });

  // Get course stats
  const { data: statsData, isLoading: statsLoading } = useCourseStats();

  // Mutations
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();

  // Filter courses based on search term
  const filteredCourses =
    coursesData?.courses?.filter(
      (course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Show loading state
  if (isLoading || coursesLoading || statsLoading) {
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

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse.mutateAsync(courseId);
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-fedpoffa-purple to-fedpoffa-orange rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Course Management</h1>
            <p className="text-white/90">Manage all courses in the system</p>
          </div>
          <Button
            className="bg-white text-fedpoffa-purple hover:bg-gray-100"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData?.total_courses || 0}
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
                <p className="text-sm font-medium text-gray-600">
                  Active Courses
                </p>
                <p className="text-2xl font-bold text-fedpoffa-green">
                  {statsData?.active_courses || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-fedpoffa-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Available Courses
                </p>
                <p className="text-2xl font-bold text-fedpoffa-orange">
                  {statsData?.available_courses || 0}
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
                <p className="text-sm font-medium text-gray-600">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold text-fedpoffa-purple">
                  {statsData?.total_enrollments || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-fedpoffa-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Assessments
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {statsData?.total_assessments || 0}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
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
          <DepartmentDropdown
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
            placeholder="All Departments"
            activeOnly={true}
            className="w-64"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Active Only</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Available Only</span>
          </label>
        </div>
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
                <div className="flex gap-2">
                  <Badge
                    variant={course.is_active ? "default" : "secondary"}
                    className={
                      course.is_active ? "bg-fedpoffa-green" : "bg-gray-500"
                    }
                  >
                    {course.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge
                    variant={course.is_available ? "default" : "secondary"}
                    className={
                      course.is_available ? "bg-fedpoffa-purple" : "bg-gray-500"
                    }
                  >
                    {course.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
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
                  <p className="font-medium">{course.semester}</p>
                </div>
                <div>
                  <p className="text-gray-500">Program</p>
                  <p className="font-medium">{course.program_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Enrolled Students</p>
                  <p className="font-medium text-fedpoffa-orange">
                    {course.total_enrolled_students}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Assessments</p>
                  <p className="font-medium text-fedpoffa-purple">
                    {course.total_assessments}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Coordinator: {course.coordinator_name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSelectedCourse(course);
                      setDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setEditId(course.id)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCourse(course);
                          setDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditId(course.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
              {searchTerm || departmentFilter || activeOnly || availableOnly
                ? "Try adjusting your search or filter criteria."
                : "No courses have been created yet."}
            </p>
            <Button
              className="bg-fedpoffa-purple hover:bg-fedpoffa-purple/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Course
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Course Details Dialog */}
      <CourseDetailsDialog
        course={selectedCourse}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userRole="admin"
      />

      {/* Course Create Modal */}
      <CourseCreateModal open={createOpen} onOpenChange={setCreateOpen} />

      {/* Course Edit Modal */}
      <CourseEditModal
        id={editId}
        open={!!editId}
        onOpenChange={(open) => setEditId(open ? editId : null)}
      />
    </div>
  );
}
