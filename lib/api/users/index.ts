// Users API Module - Barrel Export

// Export types
export type {
  User,
  UserEnrollment,
  GetUsersParams,
  UpdateUserRequest,
  GetUsersResponse,
  GetUserResponse,
  UpdateUserResponse,
  GetUserEnrollmentsResponse,
  GetUsersStatsResponse,
  ActivateUserResponse,
  DeactivateUserResponse,
  DeleteUserResponse,
  UserError,
} from "./types";

// Export service
export { UserService } from "./service";

// Export hooks
export {
  useCurrentUser,
  useUsers,
  useUser,
  useUserEnrollments,
  useUsersStats,
  useUpdateCurrentUser,
  useUpdateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useUserProfile,
  useUpdateProfile,
  useUserManagement,
  userKeys,
} from "./hooks";
