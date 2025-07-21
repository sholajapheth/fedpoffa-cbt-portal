"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProgram } from "@/lib/api/programs";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  FileText,
  User,
  GraduationCap,
  Building2,
} from "lucide-react";

export function ProgramDetailsModal({
  id,
  open,
  onOpenChange,
}: {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: program, isLoading } = useProgram(id || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {program?.name || "Program Details"}
          </DialogTitle>
          <DialogDescription>
            {program?.code ? `Code: ${program.code}` : null}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : program ? (
          <div className="space-y-6">
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
                {program.is_accepting_enrollments
                  ? "Accepting Enrollments"
                  : "Closed"}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{program.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium">{program.department_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Coordinator</p>
                    <p className="font-medium">{program.coordinator_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Level</p>
                    <p className="font-medium">{program.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">
                      {program.duration_years} years
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Enrolled Students</p>
                    <p className="font-medium text-fedpoffa-orange">
                      {program.total_enrolled_students}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Courses</p>
                    <p className="font-medium text-fedpoffa-green">
                      {program.total_courses}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Credits</p>
                    <p className="font-medium">{program.total_credits}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="font-medium">
                      {new Date(program.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Admission Requirements</h4>
              <p className="text-sm text-gray-600">
                {program.admission_requirements}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Program Outline</h4>
              <p className="text-sm text-gray-600">{program.program_outline}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Career Prospects</h4>
              <p className="text-sm text-gray-600">
                {program.career_prospects}
              </p>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Program not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
