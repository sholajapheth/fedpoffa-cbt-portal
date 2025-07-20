"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useAuthWithFeedback,
  useNavigationWithBreadcrumbs,
  useThemeManager,
  useModalManager,
  useNotificationManager,
  useFeatureFlags,
} from "@/hooks/use-stores";
import { useStores } from "@/hooks/use-stores";
import { generateId, formatDate, capitalize } from "@/lib/helpers";

export const StoreDemo = () => {
  const { auth, ui, app } = useStores();
  const {
    loginWithFeedback,
    logoutWithFeedback,
    user,
    isAuthenticated,
    isLoading,
  } = useAuthWithFeedback();
  const { navigateTo, currentPath, breadcrumbs } =
    useNavigationWithBreadcrumbs();
  const { theme, toggleTheme, setSystemTheme } = useThemeManager();
  const { openModal, closeModal, isModalOpen } = useModalManager();
  const { showSuccess, showError, showWarning, showInfo } =
    useNotificationManager();
  const { isFeatureEnabled, toggleFeature, featureFlags } = useFeatureFlags();

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      await loginWithFeedback(loginData.identifier, loginData.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    logoutWithFeedback();
  };

  const handleNotification = (
    type: "success" | "error" | "warning" | "info"
  ) => {
    const messages = {
      success: {
        title: "Success!",
        message: "This is a success notification.",
      },
      error: { title: "Error!", message: "This is an error notification." },
      warning: {
        title: "Warning!",
        message: "This is a warning notification.",
      },
      info: { title: "Info!", message: "This is an info notification." },
    };

    const { title, message } = messages[type];
    switch (type) {
      case "success":
        showSuccess(title, message);
        break;
      case "error":
        showError(title, message);
        break;
      case "warning":
        showWarning(title, message);
        break;
      case "info":
        showInfo(title, message);
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Zustand Store Demo</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive demo showcasing Zustand stores and semi-robot helpers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Authentication Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Store</CardTitle>
            <CardDescription>Manage user authentication state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Matric Number</Label>
              <Input
                id="identifier"
                type="text"
                value={loginData.identifier}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
                placeholder="Enter email (e.g., user@fedpoffa.edu.ng) or matric number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Enter your password"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1"
                >
                  Logout
                </Button>
              )}
            </div>
            {user && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium">Logged in as:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.full_name} ({user.email})
                </p>
                <Badge variant="secondary" className="mt-1">
                  {capitalize(user.role)}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  Matric: {user.matric_number}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* UI Store Demo */}
        <Card>
          <CardHeader>
            <CardTitle>UI Store</CardTitle>
            <CardDescription>Manage UI state and theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button
                  onClick={() => ui.setTheme("light")}
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                >
                  Light
                </Button>
                <Button
                  onClick={() => ui.setTheme("dark")}
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                >
                  Dark
                </Button>
                <Button
                  onClick={setSystemTheme}
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                >
                  System
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sidebar</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={ui.sidebarOpen}
                  onCheckedChange={ui.setSidebarOpen}
                />
                <span className="text-sm">Open Sidebar</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notifications</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleNotification("success")}
                  size="sm"
                  variant="outline"
                >
                  Success
                </Button>
                <Button
                  onClick={() => handleNotification("error")}
                  size="sm"
                  variant="outline"
                >
                  Error
                </Button>
                <Button
                  onClick={() => handleNotification("warning")}
                  size="sm"
                  variant="outline"
                >
                  Warning
                </Button>
                <Button
                  onClick={() => handleNotification("info")}
                  size="sm"
                  variant="outline"
                >
                  Info
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Store Demo */}
        <Card>
          <CardHeader>
            <CardTitle>App Store</CardTitle>
            <CardDescription>
              Manage app-wide state and navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Path</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {currentPath}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Breadcrumbs</Label>
              <div className="flex flex-wrap gap-1">
                {breadcrumbs.map((crumb, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {crumb.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Navigation</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => navigateTo("/dashboard")}
                  size="sm"
                  variant="outline"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigateTo("/profile")}
                  size="sm"
                  variant="outline"
                >
                  Profile
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Online Status</Label>
              <Badge variant={app.isOnline ? "default" : "destructive"}>
                {app.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>Toggle feature flags dynamically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(featureFlags).map(([flag, enabled]) => (
              <div key={flag} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium capitalize">
                    {flag.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </Label>
                  <p className="text-xs text-gray-500">
                    {enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => toggleFeature(flag)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Modal Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Modal Management</CardTitle>
            <CardDescription>Open and close modals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => openModal("demo-modal")}
                size="sm"
                variant="outline"
              >
                Open Modal
              </Button>
              <Button
                onClick={() => closeModal("demo-modal")}
                size="sm"
                variant="outline"
              >
                Close Modal
              </Button>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm">
                Modal Status:{" "}
                <Badge
                  variant={isModalOpen("demo-modal") ? "default" : "secondary"}
                >
                  {isModalOpen("demo-modal") ? "Open" : "Closed"}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Helper Functions Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Helper Functions</CardTitle>
            <CardDescription>Semi-robot helper utilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Generated ID</Label>
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {generateId()}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Formatted Date</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(new Date())}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Capitalized Text</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {capitalize("hello world")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Store State Display */}
      <Card>
        <CardHeader>
          <CardTitle>Store State</CardTitle>
          <CardDescription>Current state of all stores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Auth Store</h4>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    isAuthenticated: auth.isAuthenticated,
                    isLoading: auth.isLoading,
                    user: auth.user,
                    error: auth.error,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">UI Store</h4>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    theme: ui.theme,
                    sidebarOpen: ui.sidebarOpen,
                    sidebarCollapsed: ui.sidebarCollapsed,
                    notificationsCount: ui.notifications.length,
                    loadingStates: ui.loadingStates,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">App Store</h4>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    currentPath: app.currentPath,
                    breadcrumbs: app.breadcrumbs,
                    isOnline: app.isOnline,
                    featureFlags: app.featureFlags,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
