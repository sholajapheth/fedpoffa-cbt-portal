import { apiClient } from "@/lib/api/client";
import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseListResponse,
  CourseDetail,
  CourseEnrollmentRequest,
  CourseEnrollment,
  CourseStats,
  StudentCourseListResponse,
  LecturerCourseListResponse,
  GetCoursesParams,
  GetMyEnrolledCoursesParams,
  GetMyCoordinatedCoursesParams,
} from "./types";

// Course Service
export const courseService = {
  // Get all courses (Admin/Lecturer)
  getCourses: async (
    params?: GetCoursesParams
  ): Promise<CourseListResponse> => {
    const response = await apiClient.get("/courses/", { params });
    return response.data;
  },

  // Get course by ID
  getCourse: async (courseId: string): Promise<CourseDetail> => {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  },

  // Create course (Admin only)
  createCourse: async (data: CreateCourseRequest): Promise<Course> => {
    const response = await apiClient.post("/courses/", data);
    return response.data;
  },

  // Update course (Admin only)
  updateCourse: async (
    courseId: string,
    data: UpdateCourseRequest
  ): Promise<Course> => {
    const response = await apiClient.put(`/courses/${courseId}`, data);
    return response.data;
  },

  // Delete course (Admin only)
  deleteCourse: async (courseId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}`);
  },

  // Enroll in course (Student)
  enrollInCourse: async (
    courseId: string,
    data: CourseEnrollmentRequest
  ): Promise<CourseEnrollment> => {
    const response = await apiClient.post(`/courses/${courseId}/enroll`, data);
    return response.data;
  },

  // Get course stats (Admin only)
  getCourseStats: async (): Promise<CourseStats> => {
    const response = await apiClient.get("/courses/stats/overview");
    return response.data;
  },

  // Get my enrolled courses (Student)
  getMyEnrolledCourses: async (
    params?: GetMyEnrolledCoursesParams
  ): Promise<StudentCourseListResponse> => {
    const response = await apiClient.get("/courses/my/enrolled", { params });
    return response.data;
  },

  // Get my coordinated courses (Lecturer)
  getMyCoordinatedCourses: async (
    params?: GetMyCoordinatedCoursesParams
  ): Promise<LecturerCourseListResponse> => {
    const response = await apiClient.get("/courses/my/coordinated", { params });
    return response.data;
  },
};
