import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "./service";
import type {
  GetUsersParams,
  UpdateUserRequest,
  User,
  UserEnrollment,
} from "./types";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, "current"] as const,
  enrollments: (userId: string) =>
    [...userKeys.all, "enrollments", userId] as const,
  stats: () => [...userKeys.all, "stats"] as const,
};

// Get current user profile
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: UserService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get users list (Admin/IT Admin only)
export const useUsers = (params: GetUsersParams = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => UserService.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by ID (Admin/IT Admin only)
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => UserService.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get user enrollments (Admin/IT Admin/Lecturer only)
export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: userKeys.enrollments(userId),
    queryFn: () => UserService.getUserEnrollments(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get users statistics (Admin/IT Admin only)
export const useUsersStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: UserService.getUsersStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Update current user profile
export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) =>
      UserService.updateCurrentUser(data),
    onSuccess: (updatedUser) => {
      // Update current user cache
      queryClient.setQueryData(userKeys.current(), updatedUser);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
    onError: (error) => {
      console.error("Failed to update user profile:", error);
    },
  });
};

// Update user by ID (Admin/IT Admin only)
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserRequest;
    }) => UserService.updateUser(userId, data),
    onSuccess: (updatedUser, { userId }) => {
      // Update user cache
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });
};

// Delete user (Admin/IT Admin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => UserService.deleteUser(userId),
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
    },
  });
};

// Activate user (Admin/IT Admin only)
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => UserService.activateUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to activate user:", error);
    },
  });
};

// Deactivate user (Admin/IT Admin only)
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => UserService.deactivateUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to deactivate user:", error);
    },
  });
};

// Utility hooks for common operations
export const useUserProfile = () => {
  return useCurrentUser();
};

export const useUpdateProfile = () => {
  return useUpdateCurrentUser();
};

// Hook for user management (Admin/IT Admin)
export const useUserManagement = () => {
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();

  return {
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
  };
};
