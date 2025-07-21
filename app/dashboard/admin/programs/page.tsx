"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthWithFeedback } from "@/hooks/use-stores";
import {
  usePrograms,
  useProgramStats,
  useCreateProgram,
  useDeleteProgram,
} from "@/lib/api/programs";
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
  Plus,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  User,
  GraduationCap,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DepartmentDropdown } from "@/components/ui/department-dropdown";
import { ProgramDetailsModal } from "@/components/programs/program-details-modal";
import { ProgramEditModal } from "@/components/programs/program-edit-modal";
import { ProgramCreateModal } from "@/components/programs/program-create-modal";

export default function AdminPrograms() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthWithFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Role-based access control
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role !== "admin") {
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

  // Get all programs
  const { data: programsData, isLoading: programsLoading } = usePrograms({
    department_id: departmentFilter || undefined,
    is_active: activeOnly ? true : undefined,
    accepting_enrollments: acceptingOnly ? true : undefined,
  });

  // Get program stats
  const { data: statsData, isLoading: statsLoading } = useProgramStats();

  // Mutations
  const createProgram = useCreateProgram();
  const deleteProgram = useDeleteProgram();

  // Filter programs based on search term
  const filteredPrograms =
    programsData?.programs?.filter(
      (program) =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.department_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Show loading state
  if (isLoading || programsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fedpoffa-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const handleDeleteProgram = async (programId: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      try {
        await deleteProgram.mutateAsync(programId);
      } catch (error) {
        console.error("Failed to delete program:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-fedpoffa-purple to-fedpoffa-orange rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Program Management</h1>
            <p className="text-white/90">
              Manage all academic programs in the system
            </p>
          </div>
          <Button
            className="bg-white text-fedpoffa-purple hover:bg-gray-100"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Program
          </Button>
        </div>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Programs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData?.total_programs || 0}
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
                  Active Programs
                </p>
                <p className="text-2xl font-bold text-fedpoffa-green">
                  {statsData?.active_programs || 0}
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
                  Accepting Enrollments
                </p>
                <p className="text-2xl font-bold text-fedpoffa-orange">
                  {statsData?.accepting_enrollments || 0}
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
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {statsData?.total_courses || 0}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search programs..."
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
              checked={acceptingOnly}
              onChange={(e) => setAcceptingOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Accepting Enrollments</span>
          </label>
        </div>
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {program.code} • {program.department_name}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={program.is_active ? "default" : "secondary"}
                    className={
                      program.is_active ? "bg-fedpoffa-green" : "bg-gray-500"
                    }
                  >
                    {program.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge
                    variant={
                      program.is_accepting_enrollments ? "default" : "secondary"
                    }
                    className={
                      program.is_accepting_enrollments
                        ? "bg-fedpoffa-purple"
                        : "bg-gray-500"
                    }
                  >
                    {program.is_accepting_enrollments ? "Accepting" : "Closed"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{program.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Level</p>
                  <p className="font-medium">{program.level}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">{program.duration_years} years</p>
                </div>
                <div>
                  <p className="text-gray-500">Coordinator</p>
                  <p className="font-medium">{program.coordinator_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Credits</p>
                  <p className="font-medium">{program.total_credits}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Students</p>
                  <p className="font-medium text-fedpoffa-orange">
                    {program.total_enrolled_students}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Courses</p>
                  <p className="font-medium text-fedpoffa-green">
                    {program.total_courses}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    Created: {new Date(program.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setViewId(program.id)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setEditId(program.id)}
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
                      <DropdownMenuItem onClick={() => setViewId(program.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditId(program.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Program
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteProgram(program.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Program
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
      {filteredPrograms.length === 0 && !programsLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No programs found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || departmentFilter || activeOnly || acceptingOnly
                ? "Try adjusting your search or filter criteria."
                : "No programs have been created yet."}
            </p>
            <Button
              className="bg-fedpoffa-purple hover:bg-fedpoffa-purple/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Program
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ProgramDetailsModal
        id={viewId}
        open={!!viewId}
        onOpenChange={(open) => setViewId(open ? viewId : null)}
      />
      <ProgramEditModal
        id={editId}
        open={!!editId}
        onOpenChange={(open) => setEditId(open ? editId : null)}
      />
      <ProgramCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
