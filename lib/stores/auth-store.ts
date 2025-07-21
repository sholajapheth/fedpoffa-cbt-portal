import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AUTH_CONFIG } from "@/lib/config";
import { User } from "@/lib/api/auth/types";

// Re-export the User type from auth types
export type { User };

export interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User) => {
        set({ user });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
      },

      setIsAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Update localStorage keys to use config
        if (state && typeof window !== "undefined") {
          const oldAccessToken = localStorage.getItem("accessToken");
          const oldRefreshToken = localStorage.getItem("refreshToken");

          if (oldAccessToken) {
            localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, oldAccessToken);
            localStorage.removeItem("accessToken");
          }

          if (oldRefreshToken) {
            localStorage.setItem(
              AUTH_CONFIG.REFRESH_TOKEN_KEY,
              oldRefreshToken
            );
            localStorage.removeItem("refreshToken");
          }
        }
      },
    }
  )
);
