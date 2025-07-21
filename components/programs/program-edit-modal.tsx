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
import { UserDropdown } from "@/components/ui/user-dropdown";
import { useProgram, useUpdateProgram } from "@/lib/api/programs";

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
  department_id: z.string().min(1, "Select a department"),
  duration_years: z.coerce.number().min(1),
  level: z.string().min(1),
  total_credits: z.coerce.number().min(0),
  program_coordinator_id: z.string().min(1, "Select a coordinator"),
  admission_requirements: z.string().optional(),
  program_outline: z.string().optional(),
  career_prospects: z.string().optional(),
  is_active: z.boolean().optional(),
  is_accepting_enrollments: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProgramEditModal({
  id,
  open,
  onOpenChange,
}: {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: program, isLoading } = useProgram(id || "");
  const updateProgram = useUpdateProgram();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      department_id: "",
      duration_years: 2,
      level: "",
      total_credits: 0,
      program_coordinator_id: "",
      admission_requirements: "",
      program_outline: "",
      career_prospects: "",
      is_active: true,
      is_accepting_enrollments: true,
    },
  });

  // Populate form when program loads
  useEffect(() => {
    if (program) {
      form.reset({
        name: program.name,
        code: program.code,
        description: program.description || "",
        department_id: program.department_id,
        duration_years: program.duration_years,
        level: program.level,
        total_credits: program.total_credits,
        program_coordinator_id: program.program_coordinator_id,
        admission_requirements: program.admission_requirements || "",
        program_outline: program.program_outline || "",
        career_prospects: program.career_prospects || "",
        is_active: program.is_active,
        is_accepting_enrollments: program.is_accepting_enrollments,
      });
    }
  }, [program, form]);

  const departmentId = form.watch("department_id");

  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    // Ensure all optional string fields are always a string
    const payload = {
      ...values,
      description: values.description || "",
      admission_requirements: values.admission_requirements || "",
      program_outline: values.program_outline || "",
      career_prospects: values.career_prospects || "",
    };
    await updateProgram.mutateAsync({ programId: id, data: payload });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogDescription>Update program information</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : program ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                {...form.register("name")}
                disabled={updateProgram.isPending}
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
                disabled={updateProgram.isPending}
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
                disabled={updateProgram.isPending}
                placeholder="Select department..."
              />
              {form.formState.errors.department_id && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.department_id.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Coordinator
              </label>
              <UserDropdown
                value={form.watch("program_coordinator_id")}
                onValueChange={(val) =>
                  form.setValue("program_coordinator_id", val, {
                    shouldValidate: true,
                  })
                }
                department_id={departmentId}
                role="lecturer"
                disabled={updateProgram.isPending || !departmentId}
                placeholder={
                  departmentId
                    ? "Select coordinator..."
                    : "Select department first"
                }
              />
              {form.formState.errors.program_coordinator_id && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.program_coordinator_id.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <Input
                  {...form.register("level")}
                  disabled={updateProgram.isPending}
                />
                {form.formState.errors.level && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.level.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration (years)
                </label>
                <Input
                  type="number"
                  min={1}
                  {...form.register("duration_years", { valueAsNumber: true })}
                  disabled={updateProgram.isPending}
                />
                {form.formState.errors.duration_years && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.duration_years.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Credits
                </label>
                <Input
                  type="number"
                  min={0}
                  {...form.register("total_credits", { valueAsNumber: true })}
                  disabled={updateProgram.isPending}
                />
                {form.formState.errors.total_credits && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.total_credits.message}
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
                disabled={updateProgram.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Admission Requirements
              </label>
              <Input
                {...form.register("admission_requirements")}
                disabled={updateProgram.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Program Outline
              </label>
              <Input
                {...form.register("program_outline")}
                disabled={updateProgram.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Career Prospects
              </label>
              <Input
                {...form.register("career_prospects")}
                disabled={updateProgram.isPending}
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...form.register("is_active")}
                  disabled={updateProgram.isPending}
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...form.register("is_accepting_enrollments")}
                  disabled={updateProgram.isPending}
                />
                Accepting Enrollments
              </label>
            </div>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={updateProgram.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateProgram.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Program not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
