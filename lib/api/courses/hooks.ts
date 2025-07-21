import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "./service";
import {
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseEnrollmentRequest,
  GetCoursesParams,
  GetMyEnrolledCoursesParams,
  GetMyCoordinatedCoursesParams,
} from "./types";

// Query Keys
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (params: GetCoursesParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  stats: () => [...courseKeys.all, "stats"] as const,
  myEnrolled: (params?: GetMyEnrolledCoursesParams) =>
    [...courseKeys.all, "my-enrolled", params] as const,
  myCoordinated: (params?: GetMyCoordinatedCoursesParams) =>
    [...courseKeys.all, "my-coordinated", params] as const,
};

// Get all courses (Admin/Lecturer)
export const useCourses = (params?: GetCoursesParams) => {
  return useQuery({
    queryKey: courseKeys.list(params || {}),
    queryFn: () => courseService.getCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get course by ID
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => courseService.getCourse(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get course stats (Admin only)
export const useCourseStats = () => {
  return useQuery({
    queryKey: courseKeys.stats(),
    queryFn: () => courseService.getCourseStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get my enrolled courses (Student)
export const useMyEnrolledCourses = (params?: GetMyEnrolledCoursesParams) => {
  return useQuery({
    queryKey: courseKeys.myEnrolled(params),
    queryFn: () => courseService.getMyEnrolledCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get my coordinated courses (Lecturer)
export const useMyCoordinatedCourses = (
  params?: GetMyCoordinatedCoursesParams
) => {
  return useQuery({
    queryKey: courseKeys.myCoordinated(params),
    queryFn: () => courseService.getMyCoordinatedCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => courseService.createCourse(data),
    onSuccess: () => {
      // Invalidate and refetch courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.stats() });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: UpdateCourseRequest;
    }) => courseService.updateCourse(courseId, data),
    onSuccess: (_, { courseId }) => {
      // Invalidate specific course and lists
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.stats() });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      // Invalidate all course-related queries
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: CourseEnrollmentRequest;
    }) => courseService.enrollInCourse(courseId, data),
    onSuccess: () => {
      // Invalidate enrolled courses and course details
      queryClient.invalidateQueries({ queryKey: courseKeys.myEnrolled() });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
};
