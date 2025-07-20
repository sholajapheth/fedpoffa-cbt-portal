import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Types for app state
export interface Breadcrumb {
  label: string;
  href?: string;
  icon?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface AppState {
  // Navigation
  currentPath: string;
  breadcrumbs: Breadcrumb[];
  navigationItems: NavigationItem[];

  // App settings
  appVersion: string;
  lastUpdateCheck: number;
  isOnline: boolean;

  // Feature flags
  featureFlags: Record<string, boolean>;

  // Actions
  setCurrentPath: (path: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  addBreadcrumb: (breadcrumb: Breadcrumb) => void;
  clearBreadcrumbs: () => void;
  setNavigationItems: (items: NavigationItem[]) => void;
  updateNavigationItem: (id: string, updates: Partial<NavigationItem>) => void;
  setFeatureFlag: (flag: string, enabled: boolean) => void;
  setOnlineStatus: (online: boolean) => void;
  updateLastCheck: () => void;
}

// Semi-robot helper: Validate navigation item
const validateNavigationItem = (item: any): item is NavigationItem => {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.href === "string"
  );
};

// Semi-robot helper: Generate breadcrumbs from path
const generateBreadcrumbsFromPath = (path: string): Breadcrumb[] => {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [{ label: "Home", href: "/" }];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
};

// Semi-robot helper: Deep clone object
const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

// Semi-robot helper: Debounce function
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Default navigation items
const defaultNavigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    id: "courses",
    label: "Courses",
    href: "/courses",
    icon: "BookOpen",
    children: [
      {
        id: "my-courses",
        label: "My Courses",
        href: "/courses/my",
      },
      {
        id: "all-courses",
        label: "All Courses",
        href: "/courses/all",
      },
    ],
  },
  {
    id: "exams",
    label: "Exams",
    href: "/exams",
    icon: "FileText",
    children: [
      {
        id: "my-exams",
        label: "My Exams",
        href: "/exams/my",
      },
      {
        id: "exam-results",
        label: "Results",
        href: "/exams/results",
      },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    icon: "User",
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPath: "/",
      breadcrumbs: [{ label: "Home", href: "/" }],
      navigationItems: defaultNavigationItems,
      appVersion: "1.0.0",
      lastUpdateCheck: Date.now(),
      isOnline: navigator?.onLine ?? true,
      featureFlags: {
        darkMode: true,
        notifications: true,
        analytics: false,
        betaFeatures: false,
      },

      // Actions
      setCurrentPath: (path: string) => {
        const breadcrumbs = generateBreadcrumbsFromPath(path);
        set({ currentPath: path, breadcrumbs });
      },

      setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => {
        set({ breadcrumbs });
      },

      addBreadcrumb: (breadcrumb: Breadcrumb) => {
        set((state) => ({
          breadcrumbs: [...state.breadcrumbs, breadcrumb],
        }));
      },

      clearBreadcrumbs: () => {
        set({ breadcrumbs: [{ label: "Home", href: "/" }] });
      },

      setNavigationItems: (items: NavigationItem[]) => {
        // Validate all items
        const validItems = items.filter(validateNavigationItem);
        if (validItems.length !== items.length) {
          console.warn("Some navigation items were invalid and filtered out");
        }
        set({ navigationItems: validItems });
      },

      updateNavigationItem: (id: string, updates: Partial<NavigationItem>) => {
        set((state) => {
          const updateItem = (items: NavigationItem[]): NavigationItem[] => {
            return items.map((item) => {
              if (item.id === id) {
                return { ...item, ...updates };
              }
              if (item.children) {
                return { ...item, children: updateItem(item.children) };
              }
              return item;
            });
          };

          return {
            navigationItems: updateItem(state.navigationItems),
          };
        });
      },

      setFeatureFlag: (flag: string, enabled: boolean) => {
        set((state) => ({
          featureFlags: { ...state.featureFlags, [flag]: enabled },
        }));
      },

      setOnlineStatus: (online: boolean) => {
        set({ isOnline: online });
      },

      updateLastCheck: () => {
        set({ lastUpdateCheck: Date.now() });
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentPath: state.currentPath,
        navigationItems: state.navigationItems,
        featureFlags: state.featureFlags,
      }),
    }
  )
);
