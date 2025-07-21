// Auth API Types

export interface LoginRequest {
  identifier: string; // email or matric number
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  matric_number: string;
  password: string;
  role: "student" | "lecturer";
  department_id: string;
  phone_number: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  full_name: string;
  email: string;
  matric_number: string;
  phone_number: string;
  role: "student" | "lecturer" | "admin";
  program_id: string;
  program_name: string;
  department_id: string;
  department_name: string;
  level: string;
  profile_picture: string | null;
  bio: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
  enrolled_courses_count: number;
  completed_assessments_count: number;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

// Additional auth endpoints types
export interface VerifyEmailRequest {
  token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: string;
  timestamp: string;
}
