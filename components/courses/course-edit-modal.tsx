"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DepartmentDropdown } from "@/components/ui/department-dropdown";
import { ProgramDropdown } from "@/components/ui/program-dropdown";
import { UserDropdown } from "@/components/ui/user-dropdown";
import { useCourse, useUpdateCourse } from "@/lib/api/courses";

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
  department_id: z.string().min(1, "Select a department"),
  program_id: z.string().min(1, "Select a program"),
  credits: z.coerce.number().min(1),
  level: z.string().min(1),
  semester: z.string().min(1),
  course_coordinator_id: z.string().min(1, "Select a coordinator"),
  prerequisites: z.string().optional(),
  course_outline: z.string().optional(),
  is_active: z.boolean().optional(),
  is_available: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CourseEditModal({
  id,
  open,
  onOpenChange,
}: {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: course, isLoading } = useCourse(id || "");
  const updateCourse = useUpdateCourse();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      department_id: "",
      program_id: "",
      credits: 3,
      level: "",
      semester: "",
      course_coordinator_id: "",
      prerequisites: "",
      course_outline: "",
      is_active: true,
      is_available: true,
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        name: course.name,
        code: course.code,
        description: course.description || "",
        department_id: course.department_id,
        program_id: course.program_id,
        credits: course.credits,
        level: course.level,
        semester: course.semester,
        course_coordinator_id: course.course_coordinator_id,
        prerequisites: course.prerequisites || "",
        course_outline: course.course_outline || "",
        is_active: course.is_active,
        is_available: course.is_available,
      });
    }
  }, [course, form]);

  const departmentId = form.watch("department_id");

  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    // Ensure all optional string fields are always a string
    const payload = {
      ...values,
      description: values.description || "",
      prerequisites: values.prerequisites || "",
      course_outline: values.course_outline || "",
    };
    await updateCourse.mutateAsync({ courseId: id, data: payload });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Update the course details.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                {...form.register("name")}
                disabled={updateCourse.isPending}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <Input
                {...form.register("code")}
                disabled={updateCourse.isPending}
              />
              {form.formState.errors.code && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <DepartmentDropdown
                value={form.watch("department_id")}
                onValueChange={(val) =>
                  form.setValue("department_id", val, { shouldValidate: true })
                }
                activeOnly={true}
                disabled={updateCourse.isPending}
                placeholder="Select department..."
              />
              {form.formState.errors.department_id && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.department_id.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <ProgramDropdown
                value={form.watch("program_id")}
                onValueChange={(val) =>
                  form.setValue("program_id", val, { shouldValidate: true })
                }
                department_id={departmentId}
                activeOnly={true}
                disabled={updateCourse.isPending || !departmentId}
                placeholder={
                  departmentId ? "Select program..." : "Select department first"
                }
              />
              {form.formState.errors.program_id && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.program_id.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Coordinator
              </label>
              <UserDropdown
                value={form.watch("course_coordinator_id")}
                onValueChange={(val) =>
                  form.setValue("course_coordinator_id", val, {
                    shouldValidate: true,
                  })
                }
                department_id={departmentId}
                role="lecturer"
                disabled={updateCourse.isPending || !departmentId}
                placeholder={
                  departmentId
                    ? "Select coordinator..."
                    : "Select department first"
                }
              />
              {form.formState.errors.course_coordinator_id && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.course_coordinator_id.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <Input
                  {...form.register("level")}
                  disabled={updateCourse.isPending}
                />
                {form.formState.errors.level && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.level.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Semester
                </label>
                <Input
                  {...form.register("semester")}
                  disabled={updateCourse.isPending}
                />
                {form.formState.errors.semester && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.semester.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Credits
                </label>
                <Input
                  type="number"
                  min={1}
                  {...form.register("credits", { valueAsNumber: true })}
                  disabled={updateCourse.isPending}
                />
                {form.formState.errors.credits && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.credits.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                {...form.register("description")}
                disabled={updateCourse.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Prerequisites
              </label>
              <Input
                {...form.register("prerequisites")}
                disabled={updateCourse.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Course Outline
              </label>
              <Input
                {...form.register("course_outline")}
                disabled={updateCourse.isPending}
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...form.register("is_active")}
                  disabled={updateCourse.isPending}
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...form.register("is_available")}
                  disabled={updateCourse.isPending}
                />
                Available
              </label>
            </div>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={updateCourse.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCourse.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
