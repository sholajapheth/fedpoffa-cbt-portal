import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseService } from "./service";
import type { CreateCourseRequest, UpdateCourseRequest } from "./types";

// Query keys
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: { page: number; limit: number }) =>
    [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

// Get courses query
export const useCourses = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: courseKeys.list({ page, limit }),
    queryFn: () => CourseService.getCourses(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single course query
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => CourseService.getCourse(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create course mutation
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CourseService.createCourse,
    onSuccess: () => {
      // Invalidate and refetch courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Create course failed:", error);
    },
  });
};

// Update course mutation
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) =>
      CourseService.updateCourse(id, data),
    onSuccess: (data, variables) => {
      // Update the course in cache
      queryClient.setQueryData(courseKeys.detail(variables.id), data);
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Update course failed:", error);
    },
  });
};

// Delete course mutation
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CourseService.deleteCourse,
    onSuccess: (_, id) => {
      // Remove course from cache
      queryClient.removeQueries({ queryKey: courseKeys.detail(id) });
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Delete course failed:", error);
    },
  });
};

// Enroll in course mutation
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CourseService.enrollCourse,
    onSuccess: (data, courseId) => {
      // Update course in cache
      queryClient.setQueryData(courseKeys.detail(courseId), data);
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Enroll course failed:", error);
    },
  });
};

// Unenroll from course mutation
export const useUnenrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CourseService.unenrollCourse,
    onSuccess: (_, courseId) => {
      // Update course in cache
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Unenroll course failed:", error);
    },
  });
};
