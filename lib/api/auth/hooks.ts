import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthService } from "./service";
import { useCurrentUser, useUpdateCurrentUser } from "@/lib/api/users";
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
} from "./types";

// Auth mutations
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setTokens, setIsAuthenticated, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (response) => {
      const { user, access_token, refresh_token } = response;

      // Update Zustand store
      setUser(user);
      setTokens(access_token, refresh_token);
      setIsAuthenticated(true);

      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ["users", "current"] });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      clearAuth();
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser, setTokens, setIsAuthenticated, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: (response) => {
      const { user, access_token, refresh_token } = response;

      // Update Zustand store
      setUser(user);
      setTokens(access_token, refresh_token);
      setIsAuthenticated(true);

      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ["users", "current"] });
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      clearAuth();
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear Zustand store
      clearAuth();

      // Clear all queries
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still clear auth even if API call fails
      clearAuth();
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  const { setTokens, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => AuthService.refreshToken(data),
    onSuccess: (response) => {
      const { access_token, refresh_token } = response;
      setTokens(access_token, refresh_token);
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      clearAuth();
    },
  });
};

// User profile operations (using user service)
export const useUserProfile = () => {
  return useCurrentUser();
};

export const useUpdateProfile = () => {
  return useUpdateCurrentUser();
};

// Auth status hook
export const useAuthStatus = () => {
  const { user, accessToken, isAuthenticated } = useAuthStore();

  return {
    isLoggedIn: isAuthenticated,
    user,
    accessToken,
  };
};
