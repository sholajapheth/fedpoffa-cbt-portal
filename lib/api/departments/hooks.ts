import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "./service";
import {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  GetDepartmentsParams,
} from "./types";

// Query Keys
export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (params: GetDepartmentsParams) =>
    [...departmentKeys.lists(), params] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
  stats: () => [...departmentKeys.all, "stats"] as const,
};

// Get all departments
export const useDepartments = (params?: GetDepartmentsParams) => {
  return useQuery({
    queryKey: departmentKeys.list(params || {}),
    queryFn: () => departmentService.getDepartments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get department by ID
export const useDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: departmentKeys.detail(departmentId),
    queryFn: () => departmentService.getDepartment(departmentId),
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get department stats (Admin only)
export const useDepartmentStats = () => {
  return useQuery({
    queryKey: departmentKeys.stats(),
    queryFn: () => departmentService.getDepartmentStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutations
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) =>
      departmentService.createDepartment(data),
    onSuccess: () => {
      // Invalidate and refetch departments list
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.stats() });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      data,
    }: {
      departmentId: string;
      data: UpdateDepartmentRequest;
    }) => departmentService.updateDepartment(departmentId, data),
    onSuccess: (_, { departmentId }) => {
      // Invalidate specific department and lists
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail(departmentId),
      });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.stats() });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) =>
      departmentService.deleteDepartment(departmentId),
    onSuccess: () => {
      // Invalidate all department-related queries
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
};
