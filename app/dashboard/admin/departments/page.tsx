"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthWithFeedback } from "@/hooks/use-stores";
import {
  useDepartments,
  useDepartmentStats,
  useCreateDepartment,
  useDeleteDepartment,
} from "@/lib/api/departments";
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
  Building2,
  Users,
  FileText,
  Search,
  Plus,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  User,
  GraduationCap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DepartmentDetailsModal } from "@/components/departments/department-details-modal";
import { DepartmentEditModal } from "@/components/departments/department-edit-modal";

export default function AdminDepartments() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthWithFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
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

  // Get all departments
  const { data: departmentsData, isLoading: departmentsLoading } =
    useDepartments({
      active_only: activeOnly,
    });

  // Get department stats
  const { data: statsData, isLoading: statsLoading } = useDepartmentStats();

  // Mutations
  const createDepartment = useCreateDepartment();
  const deleteDepartment = useDeleteDepartment();

  // Filter departments based on search term
  const filteredDepartments =
    departmentsData?.departments?.filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Show loading state
  if (isLoading || departmentsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fedpoffa-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const handleDeleteDepartment = async (departmentId: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment.mutateAsync(departmentId);
      } catch (error) {
        console.error("Failed to delete department:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-fedpoffa-purple to-fedpoffa-orange rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Department Management</h1>
            <p className="text-white/90">
              Manage all departments in the system
            </p>
          </div>
          <Button
            className="bg-white text-fedpoffa-purple hover:bg-gray-100"
            onClick={() => router.push("/dashboard/admin/departments/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Department
          </Button>
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Departments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData?.total_departments || 0}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-fedpoffa-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Departments
                </p>
                <p className="text-2xl font-bold text-fedpoffa-green">
                  {statsData?.active_departments || 0}
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
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-fedpoffa-orange">
                  {statsData?.total_courses || 0}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-fedpoffa-orange" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-fedpoffa-purple">
                  {statsData?.total_students || 0}
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
                  Total Lecturers
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {statsData?.total_lecturers || 0}
                </p>
              </div>
              <User className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Active Only</span>
          </label>
        </div>
      </div>

      {/* Departments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map((department) => (
          <Card
            key={department.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Code: {department.code}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={department.is_active ? "default" : "secondary"}
                    className={
                      department.is_active ? "bg-fedpoffa-green" : "bg-gray-500"
                    }
                  >
                    {department.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{department.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">HOD</p>
                  <p className="font-medium">{department.hod_name}</p>
                  <p className="text-xs text-gray-400">
                    {department.hod_email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{department.hod_phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Students</p>
                  <p className="font-medium text-fedpoffa-orange">
                    {department.students_count}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Lecturers</p>
                  <p className="font-medium text-fedpoffa-purple">
                    {department.lecturers_count}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Courses</p>
                  <p className="font-medium text-fedpoffa-green">
                    {department.total_courses}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Programs</p>
                  <p className="font-medium text-gray-600">
                    {department.total_programs}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    Created:{" "}
                    {new Date(department.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setViewId(department.id)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setEditId(department.id)}
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
                        onClick={() => setViewId(department.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setEditId(department.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Department
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Department
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
      {filteredDepartments.length === 0 && !departmentsLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No departments found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || activeOnly
                ? "Try adjusting your search or filter criteria."
                : "No departments have been created yet."}
            </p>
            <Button
              className="bg-fedpoffa-purple hover:bg-fedpoffa-purple/90"
              onClick={() => router.push("/dashboard/admin/departments/create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Department
            </Button>
          </CardContent>
        </Card>
      )}
      <DepartmentDetailsModal
        id={viewId}
        open={!!viewId}
        onOpenChange={(open) => setViewId(open ? viewId : null)}
      />
      <DepartmentEditModal
        id={editId}
        open={!!editId}
        onOpenChange={(open) => setEditId(open ? editId : null)}
      />
    </div>
  );
}
