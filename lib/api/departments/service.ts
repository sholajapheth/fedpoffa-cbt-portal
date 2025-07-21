import { apiClient } from "@/lib/api/client";
import {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentListResponse,
  DepartmentDetail,
  DepartmentStats,
  GetDepartmentsParams,
} from "./types";

// Department Service
export const departmentService = {
  // Get all departments
  getDepartments: async (
    params?: GetDepartmentsParams
  ): Promise<DepartmentListResponse> => {
    const response = await apiClient.get("/departments/", { params });
    return response.data;
  },

  // Get department by ID
  getDepartment: async (departmentId: string): Promise<DepartmentDetail> => {
    const response = await apiClient.get(`/departments/${departmentId}`);
    return response.data;
  },

  // Create department (Admin only)
  createDepartment: async (
    data: CreateDepartmentRequest
  ): Promise<Department> => {
    const response = await apiClient.post("/departments/", data);
    return response.data;
  },

  // Update department (Admin only)
  updateDepartment: async (
    departmentId: string,
    data: UpdateDepartmentRequest
  ): Promise<Department> => {
    const response = await apiClient.put(`/departments/${departmentId}`, data);
    return response.data;
  },

  // Delete department (Admin only)
  deleteDepartment: async (departmentId: string): Promise<void> => {
    await apiClient.delete(`/departments/${departmentId}`);
  },

  // Get department stats (Admin only)
  getDepartmentStats: async (): Promise<DepartmentStats> => {
    const response = await apiClient.get("/departments/stats/overview");
    return response.data;
  },
};
