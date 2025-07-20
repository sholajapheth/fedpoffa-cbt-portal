"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  useLogin,
  useLogout,
  useUserProfile,
  useAuthStatus,
} from "@/lib/api/auth";

export function AuthDemo() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Zustand store
  const { user, isAuthenticated, accessToken } = useAuthStore();

  // TanStack Query hooks
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { isLoggedIn } = useAuthStatus();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ identifier, password });
      setIdentifier("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Demo</CardTitle>
          <CardDescription>
            Demonstrating TanStack Query + Zustand integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth Status */}
          <div className="space-y-2">
            <h3 className="font-semibold">Auth Status</h3>
            <div className="text-sm space-y-1">
              <p>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
              <p>Is Logged In: {isLoggedIn ? "Yes" : "No"}</p>
              <p>Has Access Token: {accessToken ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="space-y-2">
              <h3 className="font-semibold">User Info (Zustand)</h3>
              <div className="text-sm space-y-1">
                <p>Name: {user.full_name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Matric Number: {user.matric_number}</p>
              </div>
            </div>
          )}

          {/* Profile Data */}
          {profile && (
            <div className="space-y-2">
              <h3 className="font-semibold">Profile Data (TanStack Query)</h3>
              <div className="text-sm space-y-1">
                <p>Loading: {profileLoading ? "Yes" : "No"}</p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Login Form */}
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Matric Number</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or matric number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full"
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant="destructive"
                className="w-full"
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          )}

          {/* Mutation States */}
          <div className="space-y-2">
            <h3 className="font-semibold">Mutation States</h3>
            <div className="text-sm space-y-1">
              <p>Login Pending: {loginMutation.isPending ? "Yes" : "No"}</p>
              <p>Logout Pending: {logoutMutation.isPending ? "Yes" : "No"}</p>
              <p>Profile Loading: {profileLoading ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Error States */}
          {(loginMutation.error || logoutMutation.error) && (
            <div className="space-y-2">
              <h3 className="font-semibold text-red-600">Errors</h3>
              <div className="text-sm space-y-1">
                {loginMutation.error && (
                  <p className="text-red-600">
                    Login: {loginMutation.error.message}
                  </p>
                )}
                {logoutMutation.error && (
                  <p className="text-red-600">
                    Logout: {logoutMutation.error.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
