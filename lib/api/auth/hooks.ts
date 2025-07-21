import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AuthService } from "./service";
import { useCurrentUser, useUpdateCurrentUser } from "@/lib/api/users";
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
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

// Additional auth mutations
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => AuthService.verifyEmail(token),
    onError: (error) => {
      console.error("Email verification failed:", error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      AuthService.changePassword(data),
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
    onError: (error) => {
      console.error("Forgot password failed:", error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => AuthService.resetPassword(token, newPassword),
    onError: (error) => {
      console.error("Password reset failed:", error);
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => AuthService.resendVerification(email),
    onError: (error) => {
      console.error("Resend verification failed:", error);
    },
  });
};
