// User API Types
import { User } from "@/lib/api/auth/types";

// Re-export the User type from auth types to maintain consistency
export type { User };

// User Enrollment Interface
export interface UserEnrollment {
  id: string;
  course_id: string;
  course_name: string;
  course_code: string;
  semester_id: string;
  semester_name: string;
  enrollment_date: string;
  status: string;
  is_active: boolean;
  final_grade?: string;
  final_score?: number;
  gpa_points?: number;
  attendance_percentage?: number;
  remarks?: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
  timestamp: string;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
  data: string;
  timestamp: string;
}

export interface UsersStats {
  [key: string]: any;
}

// Request Types
export interface GetUsersParams {
  skip?: number;
  limit?: number;
  role?: string;
  department_id?: string;
  search?: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone_number?: string;
  department_id?: string;
  level?: string;
  matric_number?: string;
  profile_picture?: string;
  bio?: string;
}

// Error Types
export interface UserError {
  message: string;
  status?: number;
  code?: string;
}

// Service Response Types
export type GetUsersResponse = PaginatedResponse<User>;
export type GetUserResponse = User;
export type UpdateUserResponse = User;
export type GetUserEnrollmentsResponse = UserEnrollment[];
export type GetUsersStatsResponse = UsersStats;
export type ActivateUserResponse = SuccessResponse;
export type DeactivateUserResponse = SuccessResponse;
export type DeleteUserResponse = SuccessResponse;
