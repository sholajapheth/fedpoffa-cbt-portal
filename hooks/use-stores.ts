import { useAuthStore } from "@/lib/stores/auth-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAppStore } from "@/lib/stores/app-store";
import { useLogin, useLogout, useRegister } from "@/lib/api/auth";
import { useCallback, useEffect } from "react";

// Semi-robot helper: Combine multiple store selectors
export const useStores = () => {
  const auth = useAuthStore();
  const ui = useUIStore();
  const app = useAppStore();

  return { auth, ui, app };
};

// Semi-robot helper: Authentication with UI feedback
export const useAuthWithFeedback = () => {
  const { auth, ui } = useStores();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  const loginWithFeedback = useCallback(
    async (identifier: string, password: string) => {
      try {
        ui.setLoading("auth", true);
        await loginMutation.mutateAsync({ identifier, password });
        ui.addNotification({
          type: "success",
          title: "Login Successful",
          message: "Welcome back!",
        });
      } catch (error) {
        ui.addNotification({
          type: "error",
          title: "Login Failed",
          message: error instanceof Error ? error.message : "An error occurred",
        });
        throw error;
      } finally {
        ui.setLoading("auth", false);
      }
    },
    [loginMutation, ui]
  );

  const logoutWithFeedback = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      ui.addNotification({
        type: "info",
        title: "Logged Out",
        message: "You have been successfully logged out",
      });
    } catch (error) {
      ui.addNotification({
        type: "error",
        title: "Logout Failed",
        message: "An error occurred during logout",
      });
    }
  }, [logoutMutation, ui]);

  const registerWithFeedback = useCallback(
    async (userData: any) => {
      try {
        ui.setLoading("auth", true);
        await registerMutation.mutateAsync(userData);
        ui.addNotification({
          type: "success",
          title: "Registration Successful",
          message: "Account created successfully!",
        });
      } catch (error) {
        ui.addNotification({
          type: "error",
          title: "Registration Failed",
          message: error instanceof Error ? error.message : "An error occurred",
        });
        throw error;
      } finally {
        ui.setLoading("auth", false);
      }
    },
    [registerMutation, ui]
  );

  return {
    loginWithFeedback,
    logoutWithFeedback,
    registerWithFeedback,
    isLoading:
      ui.loadingStates.auth ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
  };
};

// Semi-robot helper: Navigation with breadcrumbs
export const useNavigationWithBreadcrumbs = () => {
  const { app, ui } = useStores();

  const navigateTo = useCallback(
    (path: string) => {
      app.setCurrentPath(path);
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 768) {
        ui.setSidebarOpen(false);
      }
    },
    [app, ui]
  );

  const navigateWithBreadcrumb = useCallback(
    (path: string, breadcrumb: any) => {
      app.setCurrentPath(path);
      app.addBreadcrumb(breadcrumb);
    },
    [app]
  );

  return {
    navigateTo,
    navigateWithBreadcrumb,
    currentPath: app.currentPath,
    breadcrumbs: app.breadcrumbs,
    navigationItems: app.navigationItems,
  };
};

// Semi-robot helper: Theme management
export const useThemeManager = () => {
  const { ui } = useStores();

  const toggleTheme = useCallback(() => {
    const currentTheme = ui.theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    ui.setTheme(newTheme);
  }, [ui]);

  const setSystemTheme = useCallback(() => {
    ui.setTheme("system");
  }, [ui]);

  return {
    theme: ui.theme,
    toggleTheme,
    setSystemTheme,
    setTheme: ui.setTheme,
  };
};

// Semi-robot helper: Modal management
export const useModalManager = () => {
  const { ui } = useStores();

  const openModal = useCallback(
    (modalId: string) => {
      ui.openModal(modalId);
    },
    [ui]
  );

  const closeModal = useCallback(
    (modalId: string) => {
      ui.closeModal(modalId);
    },
    [ui]
  );

  const isModalOpen = useCallback(
    (modalId: string) => {
      return ui.modals[modalId] || false;
    },
    [ui]
  );

  return {
    openModal,
    closeModal,
    isModalOpen,
    closeAllModals: ui.closeAllModals,
  };
};

// Semi-robot helper: Notification management
export const useNotificationManager = () => {
  const { ui } = useStores();

  const showSuccess = useCallback(
    (title: string, message: string) => {
      ui.addNotification({ type: "success", title, message });
    },
    [ui]
  );

  const showError = useCallback(
    (title: string, message: string) => {
      ui.addNotification({ type: "error", title, message });
    },
    [ui]
  );

  const showWarning = useCallback(
    (title: string, message: string) => {
      ui.addNotification({ type: "warning", title, message });
    },
    [ui]
  );

  const showInfo = useCallback(
    (title: string, message: string) => {
      ui.addNotification({ type: "info", title, message });
    },
    [ui]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    notifications: ui.notifications,
    removeNotification: ui.removeNotification,
    clearNotifications: ui.clearNotifications,
  };
};

// Semi-robot helper: Online status monitoring
export const useOnlineStatus = () => {
  const { app, ui } = useStores();

  useEffect(() => {
    const handleOnline = () => {
      app.setOnlineStatus(true);
      ui.addNotification({
        type: "success",
        title: "Back Online",
        message: "Connection restored",
      });
    };

    const handleOffline = () => {
      app.setOnlineStatus(false);
      ui.addNotification({
        type: "warning",
        title: "Offline",
        message: "You are currently offline",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [app, ui]);

  return {
    isOnline: app.isOnline,
  };
};

// Semi-robot helper: Feature flag management
export const useFeatureFlags = () => {
  const { app } = useStores();

  const isFeatureEnabled = useCallback(
    (flag: string) => {
      return app.featureFlags[flag] || false;
    },
    [app]
  );

  const toggleFeature = useCallback(
    (flag: string) => {
      const currentState = app.featureFlags[flag] || false;
      app.setFeatureFlag(flag, !currentState);
    },
    [app]
  );

  return {
    featureFlags: app.featureFlags,
    isFeatureEnabled,
    toggleFeature,
    setFeatureFlag: app.setFeatureFlag,
  };
};
