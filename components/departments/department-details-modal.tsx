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
import { useDepartment } from "@/lib/api/departments";
import { Button } from "@/components/ui/button";
import { Building2, Users, FileText, User, GraduationCap } from "lucide-react";

interface DepartmentDetailsModalProps {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartmentDetailsModal({
  id,
  open,
  onOpenChange,
}: DepartmentDetailsModalProps) {
  const { data: department, isLoading } = useDepartment(id || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {department?.name || "Department Details"}
          </DialogTitle>
          <DialogDescription>
            {department?.code ? `Code: ${department.code}` : null}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : department ? (
          <div className="space-y-6">
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
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{department.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">HOD</p>
                    <p className="font-medium">{department.hod_name}</p>
                    <p className="text-xs text-gray-400">
                      {department.hod_email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{department.hod_phone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Students</p>
                    <p className="font-medium text-fedpoffa-orange">
                      {department.students_count}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Lecturers</p>
                    <p className="font-medium text-fedpoffa-purple">
                      {department.lecturers_count}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
            <Separator />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Department not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
