import { createAxiosInstance, handleApiError } from "@/lib/api/axios-config";
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseListResponse,
  CourseError,
} from "./types";

// Create course-specific axios instance with custom configuration
const courseApi = createAxiosInstance({
  // Course-specific configuration can be added here
  headers: {
    "X-Service": "courses", // Custom header to identify course service
  },
});

// Course API service
export class CourseService {
  static async getCourses(
    page: number = 1,
    limit: number = 10
  ): Promise<CourseListResponse> {
    try {
      const response = await courseApi.get<CourseListResponse>("/courses", {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async getCourse(id: string): Promise<Course> {
    try {
      const response = await courseApi.get<Course>(`/courses/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async createCourse(data: CreateCourseRequest): Promise<Course> {
    try {
      const response = await courseApi.post<Course>("/courses", data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async updateCourse(
    id: string,
    data: UpdateCourseRequest
  ): Promise<Course> {
    try {
      const response = await courseApi.put<Course>(`/courses/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async deleteCourse(id: string): Promise<void> {
    try {
      await courseApi.delete(`/courses/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async enrollCourse(id: string): Promise<Course> {
    try {
      const response = await courseApi.post<Course>(`/courses/${id}/enroll`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async unenrollCourse(id: string): Promise<void> {
    try {
      await courseApi.delete(`/courses/${id}/enroll`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: any): CourseError {
    return handleApiError(error);
  }
}
