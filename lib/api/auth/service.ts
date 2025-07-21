import { createAxiosInstance, handleApiError } from "@/lib/api/axios-config";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  AuthError,
  VerifyEmailRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendVerificationRequest,
  AuthResponse,
} from "./types";

// Create auth-specific axios instance with custom configuration
const authApi = createAxiosInstance({
  // Auth-specific configuration can be added here
  headers: {
    "X-Service": "auth", // Custom header to identify auth service
  },
});

// Auth API service
export class AuthService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authApi.post<LoginResponse>("/auth/login", data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await authApi.post<LoginResponse>(
        "/auth/register",
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async refreshToken(
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      const response = await authApi.post<RefreshTokenResponse>(
        "/auth/refresh",
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async logout(): Promise<void> {
    try {
      await authApi.post("/auth/logout");
    } catch (error: any) {
      // Don't throw error for logout, just clear tokens
    } finally {
      // Always clear tokens on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  }

  // Email verification
  static async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>(
        `/auth/verify-email?token=${encodeURIComponent(token)}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Change password
  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>(
        "/auth/change-password",
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>(
        `/auth/forgot-password?email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Reset password
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>(
        `/auth/reset-password?token=${encodeURIComponent(
          token
        )}&new_password=${encodeURIComponent(newPassword)}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Resend verification email
  static async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>(
        `/auth/resend-verification?email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: any): AuthError {
    return handleApiError(error);
  }
}
