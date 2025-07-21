// Program API Types

export interface Program {
  id: string;
  name: string;
  code: string;
  description: string;
  department_id: string;
  department_name: string;
  duration_years: number;
  level: string;
  total_credits: number;
  program_coordinator_id: string;
  coordinator_name: string;
  admission_requirements: string;
  program_outline: string;
  career_prospects: string;
  is_active: boolean;
  is_accepting_enrollments: boolean;
  created_at: string;
  updated_at: string;
  total_enrolled_students: number;
  total_courses: number;
}

export interface CreateProgramRequest {
  name: string;
  code: string;
  description: string;
  department_id: string;
  duration_years: number;
  level: string;
  total_credits: number;
  program_coordinator_id: string;
  admission_requirements: string;
  program_outline: string;
  career_prospects: string;
}

export interface UpdateProgramRequest extends Partial<CreateProgramRequest> {
  is_active?: boolean;
  is_accepting_enrollments?: boolean;
}

export interface ProgramListResponse {
  programs: Program[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ProgramStats {
  total_programs: number;
  active_programs: number;
  accepting_enrollments: number;
  total_enrollments: number;
  total_courses: number;
}

export type GetProgramResponse = Program & {
  enrolled_students?: any[];
  courses?: any[];
};

export type CreateProgramResponse = Program;
export type UpdateProgramResponse = Program;
