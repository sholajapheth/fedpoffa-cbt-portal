import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Types for UI state
export interface UIState {
  // Theme
  theme: "light" | "dark" | "system";

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modals and dialogs
  modals: Record<string, boolean>;

  // Notifications
  notifications: Notification[];

  // Loading states
  loadingStates: Record<string, boolean>;

  // Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
}

// Semi-robot helper: Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Semi-robot helper: Validate theme
const isValidTheme = (theme: string): theme is "light" | "dark" | "system" => {
  return ["light", "dark", "system"].includes(theme);
};

// Semi-robot helper: Validate notification type
const isValidNotificationType = (
  type: string
): type is Notification["type"] => {
  return ["success", "error", "warning", "info"].includes(type);
};

// Semi-robot helper: Create notification with defaults
const createNotification = (
  notification: Omit<Notification, "id" | "timestamp">
): Notification => {
  return {
    id: generateId(),
    timestamp: Date.now(),
    duration: 5000, // 5 seconds default
    ...notification,
  };
};

// Semi-robot helper: Auto-remove notifications after duration
const autoRemoveNotification = (
  notifications: Notification[],
  setNotifications: (notifications: Notification[]) => void
) => {
  const now = Date.now();
  const activeNotifications = notifications.filter(
    (notification) =>
      !notification.duration ||
      now - notification.timestamp < notification.duration
  );

  if (activeNotifications.length !== notifications.length) {
    setNotifications(activeNotifications);
  }
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: "system",
      sidebarOpen: false,
      sidebarCollapsed: false,
      modals: {},
      notifications: [],
      loadingStates: {},

      // Actions
      setTheme: (theme: "light" | "dark" | "system") => {
        if (isValidTheme(theme)) {
          set({ theme });
        } else {
          console.warn("Invalid theme:", theme);
        }
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      openModal: (modalId: string) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        }));
      },

      closeModal: (modalId: string) => {
        set((state) => {
          const newModals = { ...state.modals };
          delete newModals[modalId];
          return { modals: newModals };
        });
      },

      closeAllModals: () => {
        set({ modals: {} });
      },

      addNotification: (
        notificationData: Omit<Notification, "id" | "timestamp">
      ) => {
        if (!isValidNotificationType(notificationData.type)) {
          console.warn("Invalid notification type:", notificationData.type);
          return;
        }

        const notification = createNotification(notificationData);

        set((state) => {
          const newNotifications = [...state.notifications, notification];

          // Auto-remove expired notifications
          setTimeout(() => {
            autoRemoveNotification(newNotifications, (notifications) => {
              set({ notifications });
            });
          }, 100);

          return { notifications: newNotifications };
        });
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      setLoading: (key: string, loading: boolean) => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: loading },
        }));
      },

      clearLoading: (key: string) => {
        set((state) => {
          const newLoadingStates = { ...state.loadingStates };
          delete newLoadingStates[key];
          return { loadingStates: newLoadingStates };
        });
      },
    }),
    {
      name: "ui-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
