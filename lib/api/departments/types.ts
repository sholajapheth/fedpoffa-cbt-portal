// Department API Types

// Base Department Interface
export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  hod_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_programs: number;
  total_courses: number;
  students_count: number;
  lecturers_count: number;
  hod_name: string;
  hod_email: string;
  hod_phone: string;
}

// Department Creation Request
export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description: string;
  hod_id: string;
}

// Department Update Request
export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  hod_id?: string;
  is_active?: boolean;
}

// Department Detail with Related Data
export interface DepartmentDetail extends Department {
  courses: any[];
  users: any[];
}

// Department List Response
export interface DepartmentListResponse {
  departments: Department[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Department Stats
export interface DepartmentStats {
  total_departments: number;
  active_departments: number;
  total_courses: number;
  total_students: number;
  total_lecturers: number;
}

// Get Departments Parameters
export interface GetDepartmentsParams {
  skip?: number;
  limit?: number;
  active_only?: boolean;
}

// API Response Types
export type CreateDepartmentResponse = Department;
export type UpdateDepartmentResponse = Department;
export type GetDepartmentResponse = DepartmentDetail;
export type GetDepartmentStatsResponse = DepartmentStats;
