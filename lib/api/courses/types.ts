// Course API Types

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  department_id: string;
  lecturer_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseRequest {
  name: string;
  code: string;
  description: string;
  credits: number;
  department_id: string;
  lecturer_id: string;
}

export interface UpdateCourseRequest {
  name?: string;
  code?: string;
  description?: string;
  credits?: number;
  department_id?: string;
  lecturer_id?: string;
  is_active?: boolean;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
}

export interface CourseError {
  message: string;
  code?: string;
  status?: number;
}
