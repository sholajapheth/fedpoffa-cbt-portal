import { apiClient, handleApiError } from "@/lib/api/axios-config";
import type {
  User,
  GetUsersParams,
  UpdateUserRequest,
  GetUsersResponse,
  GetUserResponse,
  UpdateUserResponse,
  GetUserEnrollmentsResponse,
  GetUsersStatsResponse,
  ActivateUserResponse,
  DeactivateUserResponse,
  DeleteUserResponse,
  UserError,
} from "./types";

// User API service using centralized apiClient
export class UserService {
  // Get paginated list of users (Admin/IT Admin only)
  static async getUsers(
    params: GetUsersParams = {}
  ): Promise<GetUsersResponse> {
    try {
      const response = await apiClient.get<GetUsersResponse>("/users", {
        params: {
          skip: params.skip || 0,
          limit: params.limit || 100,
          ...(params.role && { role: params.role }),
          ...(params.department_id && { department_id: params.department_id }),
          ...(params.search && { search: params.search }),
          ...(params.is_active !== undefined && {
            is_active: params.is_active,
          }),
        },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get current user profile
  static async getCurrentUser(): Promise<GetUserResponse> {
    try {
      const response = await apiClient.get<GetUserResponse>("/users/me");
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Update current user profile
  static async updateCurrentUser(
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    try {
      const response = await apiClient.put<UpdateUserResponse>(
        "/users/me",
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get user by ID (Admin/IT Admin only)
  static async getUserById(userId: string): Promise<GetUserResponse> {
    try {
      const response = await apiClient.get<GetUserResponse>(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Update user by ID (Admin/IT Admin only)
  static async updateUser(
    userId: string,
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse> {
    try {
      const response = await apiClient.put<UpdateUserResponse>(
        `/users/${userId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete user (Admin/IT Admin only)
  static async deleteUser(userId: string): Promise<DeleteUserResponse> {
    try {
      const response = await apiClient.delete<DeleteUserResponse>(
        `/users/${userId}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get user enrollments (Admin/IT Admin/Lecturer only)
  static async getUserEnrollments(
    userId: string
  ): Promise<GetUserEnrollmentsResponse> {
    try {
      const response = await apiClient.get<GetUserEnrollmentsResponse>(
        `/users/${userId}/enrollments`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Activate user (Admin/IT Admin only)
  static async activateUser(userId: string): Promise<ActivateUserResponse> {
    try {
      const response = await apiClient.post<ActivateUserResponse>(
        `/users/${userId}/activate`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Deactivate user (Admin/IT Admin only)
  static async deactivateUser(userId: string): Promise<DeactivateUserResponse> {
    try {
      const response = await apiClient.post<DeactivateUserResponse>(
        `/users/${userId}/deactivate`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get users statistics (Admin/IT Admin only)
  static async getUsersStats(): Promise<GetUsersStatsResponse> {
    try {
      const response = await apiClient.get<GetUsersStatsResponse>(
        "/users/stats/overview"
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Helper method to handle errors
  private static handleError(error: any): UserError {
    return handleApiError(error);
  }
}
