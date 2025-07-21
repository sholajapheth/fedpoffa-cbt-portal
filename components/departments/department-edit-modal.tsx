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
import { useDepartment, useUpdateDepartment } from "@/lib/api/departments";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";
import { UserDropdown } from "@/components/ui/user-dropdown";

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
  hod_id: z.string().min(1, "Please select a Head of Department"),
  is_active: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

interface DepartmentEditModalProps {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartmentEditModal({
  id,
  open,
  onOpenChange,
}: DepartmentEditModalProps) {
  const { data: department, isLoading } = useDepartment(id || "");
  const updateDepartment = useUpdateDepartment();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      hod_id: "",
      is_active: true,
    },
  });

  // Populate form when department loads
  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        code: department.code,
        description: department.description,
        hod_id: department.hod_id,
        is_active: department.is_active,
      });
    }
  }, [department, form]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    try {
      await updateDepartment.mutateAsync({
        departmentId: id,
        data: {
          name: values.name,
          code: values.code,
          description: values.description,
          hod_id: values.hod_id,
          is_active: values.is_active,
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Edit Department
          </DialogTitle>
          <DialogDescription>Update department information</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : department ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                {...form.register("name")}
                disabled={updateDepartment.isPending}
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
                disabled={updateDepartment.isPending}
              />
              {form.formState.errors.code && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                {...form.register("description")}
                disabled={updateDepartment.isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Head of Department
              </label>
              <UserDropdown
                value={form.watch("hod_id")}
                onValueChange={(val) =>
                  form.setValue("hod_id", val, { shouldValidate: true })
                }
                department_id={department?.id}
                role="lecturer"
                disabled={updateDepartment.isPending}
                placeholder="Select HOD..."
              />
              {form.formState.errors.hod_id && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.hod_id.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...form.register("is_active")}
                  disabled={updateDepartment.isPending}
                />
                Active
              </label>
            </div>

            <Separator />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={updateDepartment.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateDepartment.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Department not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
