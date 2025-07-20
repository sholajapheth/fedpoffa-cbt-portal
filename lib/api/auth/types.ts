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
  full_name: string;
  email: string;
  matric_number: string;
  role: "student" | "lecturer" | "admin";
  department_id: string;
  is_verified: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}
