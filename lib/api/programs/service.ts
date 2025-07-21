import { apiClient } from "@/lib/api/client";
import type {
  Program,
  CreateProgramRequest,
  UpdateProgramRequest,
  ProgramListResponse,
  ProgramStats,
  GetProgramResponse,
  CreateProgramResponse,
  UpdateProgramResponse,
} from "./types";

export const programService = {
  getPrograms: async (params?: any): Promise<ProgramListResponse> => {
    const response = await apiClient.get("/programs/", { params });
    return response.data;
  },
  getProgram: async (programId: string): Promise<GetProgramResponse> => {
    const response = await apiClient.get(`/programs/${programId}`);
    return response.data;
  },
  createProgram: async (
    data: CreateProgramRequest
  ): Promise<CreateProgramResponse> => {
    const response = await apiClient.post("/programs/", data);
    return response.data;
  },
  updateProgram: async (
    programId: string,
    data: UpdateProgramRequest
  ): Promise<UpdateProgramResponse> => {
    const response = await apiClient.put(`/programs/${programId}`, data);
    return response.data;
  },
  deleteProgram: async (programId: string): Promise<void> => {
    await apiClient.delete(`/programs/${programId}`);
  },
  getProgramStats: async (): Promise<ProgramStats> => {
    const response = await apiClient.get("/programs/stats");
    return response.data;
  },
  getDepartmentPrograms: async (departmentId: string): Promise<Program[]> => {
    const response = await apiClient.get(
      `/programs/department/${departmentId}`
    );
    return response.data;
  },
  getProgramEnrollments: async (
    programId: string,
    params?: any
  ): Promise<any[]> => {
    const response = await apiClient.get(`/programs/${programId}/enrollments`, {
      params,
    });
    return response.data;
  },
  enrollStudentInProgram: async (
    programId: string,
    data: { user_id: string; admission_number: string }
  ): Promise<any> => {
    const response = await apiClient.post(
      `/programs/${programId}/enroll`,
      data
    );
    return response.data;
  },
};
