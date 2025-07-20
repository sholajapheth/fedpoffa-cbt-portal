"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAppStore } from "@/lib/stores/app-store";

interface StoreProviderProps {
  children: ReactNode;
}

// Semi-robot helper: Initialize stores and set up global listeners
export const StoreProvider = ({ children }: StoreProviderProps) => {
  const { setOnlineStatus } = useAppStore();
  const { addNotification } = useUIStore();

  // Initialize online status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      addNotification({
        type: "success",
        title: "Back Online",
        message: "Connection restored",
      });
    };

    const handleOffline = () => {
      setOnlineStatus(false);
      addNotification({
        type: "warning",
        title: "Offline",
        message: "You are currently offline",
      });
    };

    // Set initial online status
    setOnlineStatus(navigator.onLine);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnlineStatus, addNotification]);

  // Semi-robot helper: Auto-clear expired notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const { notifications, removeNotification } = useUIStore.getState();
      const now = Date.now();

      notifications.forEach((notification) => {
        if (
          notification.duration &&
          now - notification.timestamp > notification.duration
        ) {
          removeNotification(notification.id);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Semi-robot helper: Sync theme with system preference
  useEffect(() => {
    const { theme, setTheme } = useUIStore.getState();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);

      // Set initial theme based on system preference
      setTheme(mediaQuery.matches ? "dark" : "light");

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Semi-robot helper: Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - could pause animations, stop timers, etc.
        console.log("Page hidden");
      } else {
        // Page is visible again
        console.log("Page visible");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Semi-robot helper: Handle window resize for responsive behavior
  useEffect(() => {
    const { setSidebarOpen } = useUIStore.getState();

    const handleResize = () => {
      // Close sidebar on mobile when screen becomes larger
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <>{children}</>;
};
