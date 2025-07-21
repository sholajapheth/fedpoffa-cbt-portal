"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  User,
  GraduationCap,
  Clock,
  BarChart3,
} from "lucide-react";
import { Course } from "@/lib/api/courses/types";

interface CourseDetailsDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: "student" | "lecturer" | "admin";
}

export function CourseDetailsDialog({
  course,
  open,
  onOpenChange,
  userRole = "admin",
}: CourseDetailsDialogProps) {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {course.name}
          </DialogTitle>
          <DialogDescription>
            Course Code: {course.code} • {course.department_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Status */}
          <div className="flex gap-2">
            <Badge
              variant={course.is_active ? "default" : "secondary"}
              className={course.is_active ? "bg-fedpoffa-green" : "bg-gray-500"}
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

          {/* Course Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">{course.description}</p>
          </div>

          {/* Course Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Credits</p>
                  <p className="font-medium">{course.credits}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="font-medium">{course.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Semester</p>
                  <p className="font-medium">{course.semester}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Coordinator</p>
                  <p className="font-medium">{course.coordinator_name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Enrolled Students</p>
                  <p className="font-medium text-fedpoffa-orange">
                    {course.total_enrolled_students}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Total Assessments</p>
                  <p className="font-medium text-fedpoffa-purple">
                    {course.total_assessments}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Program</p>
                  <p className="font-medium">{course.program_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          {course.prerequisites && (
            <div>
              <h4 className="font-medium mb-2">Prerequisites</h4>
              <p className="text-sm text-gray-600">{course.prerequisites}</p>
            </div>
          )}

          {/* Course Outline */}
          {course.course_outline && (
            <div>
              <h4 className="font-medium mb-2">Course Outline</h4>
              <p className="text-sm text-gray-600">{course.course_outline}</p>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {userRole === "admin" && (
              <Button className="bg-fedpoffa-purple hover:bg-fedpoffa-purple/90">
                Edit Course
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
