"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  useLogin,
  useRegister,
  useLogout,
  useUserProfile,
} from "@/lib/api/auth/hooks";

export type UserRole = "student" | "lecturer" | "admin" | "it_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  staffId?: string;
  department?: string;
  program?: string;
  level?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface LoginCredentials {
  identifier: string; // student ID or email
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Zustand store
  const { user, isAuthenticated, accessToken, clearAuth } = useAuthStore();

  // TanStack Query hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  useEffect(() => {
    // Check for existing session
    if (accessToken && user) {
      // User is authenticated, redirect to appropriate dashboard
      if (user.role === "student") {
        router.push("/dashboard/student");
      } else if (user.role === "lecturer") {
        router.push("/dashboard/lecturer");
      } else {
        router.push("/dashboard/admin");
      }
    }
    setLoading(false);
  }, [user, accessToken, router]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await loginMutation.mutateAsync({
        identifier: credentials.identifier,
        password: credentials.password,
      });

      const user = response.user;

      // Redirect based on role
      if (user?.role === "student") {
        router.push("/dashboard/student");
      } else if (user?.role === "lecturer") {
        router.push("/dashboard/lecturer");
      } else {
        router.push("/dashboard/admin");
      }
    } catch (error: any) {
      console.log("Login error:", error);
      throw new Error(error?.message || "Invalid credentials");
    }
  };

  const register = async (data: RegisterData) => {
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await registerMutation.mutateAsync({
        first_name: data.fullName.split(" ")[0] || "",
        last_name: data.fullName.split(" ").slice(1).join(" ") || "",
        middle_name: "",
        email: data.email,
        matric_number: data.studentId,
        password: data.password,
        role: "student",
        department_id: "default-dept-id", // This should come from a form
        phone_number: "",
      });

      router.push("/dashboard/student");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Still clear auth even if API call fails
      clearAuth();
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user as User | null,
        login,
        register,
        logout,
        loading:
          loading ||
          loginMutation.isPending ||
          registerMutation.isPending ||
          logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
