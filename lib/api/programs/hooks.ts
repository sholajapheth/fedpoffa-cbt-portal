import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { programService } from "./service";
import type {
  CreateProgramRequest,
  UpdateProgramRequest,
  ProgramListResponse,
  ProgramStats,
  GetProgramResponse,
  Program,
} from "./types";

// Query Keys
export const programKeys = {
  all: ["programs"] as const,
  lists: () => [...programKeys.all, "list"] as const,
  list: (params?: any) => [...programKeys.lists(), params] as const,
  details: () => [...programKeys.all, "detail"] as const,
  detail: (id: string) => [...programKeys.details(), id] as const,
  stats: () => [...programKeys.all, "stats"] as const,
  department: (departmentId: string) =>
    [...programKeys.all, "department", departmentId] as const,
  enrollments: (programId: string) =>
    [...programKeys.detail(programId), "enrollments"] as const,
};

// Get all programs
export const usePrograms = (params?: any) => {
  return useQuery({
    queryKey: programKeys.list(params),
    queryFn: () => programService.getPrograms(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Get program by ID
export const useProgram = (programId: string) => {
  return useQuery({
    queryKey: programKeys.detail(programId),
    queryFn: () => programService.getProgram(programId),
    enabled: !!programId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get program stats
export const useProgramStats = () => {
  return useQuery({
    queryKey: programKeys.stats(),
    queryFn: () => programService.getProgramStats(),
    staleTime: 10 * 60 * 1000,
  });
};

// Get programs for a department
export const useDepartmentPrograms = (departmentId: string) => {
  return useQuery({
    queryKey: programKeys.department(departmentId),
    queryFn: () => programService.getDepartmentPrograms(departmentId),
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get enrollments for a program
export const useProgramEnrollments = (programId: string, params?: any) => {
  return useQuery({
    queryKey: [...programKeys.enrollments(programId), params],
    queryFn: () => programService.getProgramEnrollments(programId, params),
    enabled: !!programId,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProgramRequest) =>
      programService.createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.stats() });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      programId,
      data,
    }: {
      programId: string;
      data: UpdateProgramRequest;
    }) => programService.updateProgram(programId, data),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({
        queryKey: programKeys.detail(programId),
      });
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.stats() });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programId: string) => programService.deleteProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.stats() });
    },
  });
};

export const useEnrollStudentInProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      programId,
      data,
    }: {
      programId: string;
      data: { user_id: string; admission_number: string };
    }) => programService.enrollStudentInProgram(programId, data),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({
        queryKey: programKeys.enrollments(programId),
      });
    },
  });
};
