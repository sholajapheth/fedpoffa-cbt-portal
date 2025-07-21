// Course API Types

// Base Course Interface
export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  department_id: string;
  program_id: string;
  credits: number;
  level: string;
  semester: string;
  course_coordinator_id: string;
  prerequisites: string;
  course_outline: string;
  is_active: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  department_name: string;
  program_name: string;
  coordinator_name: string;
  total_enrolled_students: number;
  total_assessments: number;
}

// Course Creation Request
export interface CreateCourseRequest {
  name: string;
  code: string;
  description: string;
  department_id: string;
  program_id: string;
  credits: number;
  level: string;
  semester: string;
  course_coordinator_id: string;
  prerequisites: string;
  course_outline: string;
}

// Course Update Request
export interface UpdateCourseRequest {
  name?: string;
  code?: string;
  description?: string;
  department_id?: string;
  program_id?: string;
  credits?: number;
  level?: string;
  semester?: string;
  course_coordinator_id?: string;
  prerequisites?: string;
  course_outline?: string;
  is_active?: boolean;
  is_available?: boolean;
}

// Course Detail with Related Data
export interface CourseDetail extends Course {
  enrolled_students: any[];
  assessments: any[];
}

// Course List Response
export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Course Stats
export interface CourseStats {
  total_courses: number;
  active_courses: number;
  available_courses: number;
  total_enrollments: number;
  total_assessments: number;
}

// Course Enrollment
export interface CourseEnrollment {
  id: string;
  student_id: string;
  course_id: string;
  semester_id: string;
  enrollment_date: string;
  status: string;
  is_active: boolean;
  student_name: string;
  course_name: string;
  semester_name: string;
}

// Course Enrollment Request
export interface CourseEnrollmentRequest {
  course_id: string;
  semester_id: string;
}

// Student Enrolled Course
export interface StudentEnrolledCourse {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  level: string;
  semester: string;
  department_name: string;
  program_name: string;
  coordinator_name: string;
  enrollment_id: string;
  enrollment_date: string;
  enrollment_status: string;
  final_grade: string;
  final_score: number;
  gpa_points: number;
  attendance_percentage: number;
  remarks: string;
  semester_name: string;
  total_assessments: number;
}

// Lecturer Coordinated Course
export interface LecturerCoordinatedCourse {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  level: string;
  semester: string;
  department_name: string;
  program_name: string;
  is_active: boolean;
  is_available: boolean;
  prerequisites: string;
  course_outline: string;
  total_enrolled_students: number;
  total_assessments: number;
  created_at: string;
  updated_at: string;
}

// Student Course List Response
export interface StudentCourseListResponse {
  courses: StudentEnrolledCourse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Lecturer Course List Response
export interface LecturerCourseListResponse {
  courses: LecturerCoordinatedCourse[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Get Courses Parameters
export interface GetCoursesParams {
  skip?: number;
  limit?: number;
  department_id?: string;
  active_only?: boolean;
  available_only?: boolean;
}

// Get My Enrolled Courses Parameters
export interface GetMyEnrolledCoursesParams {
  skip?: number;
  limit?: number;
  status_filter?: string;
}

// Get My Coordinated Courses Parameters
export interface GetMyCoordinatedCoursesParams {
  skip?: number;
  limit?: number;
  active_only?: boolean;
}

// API Response Types
export type CreateCourseResponse = Course;
export type UpdateCourseResponse = Course;
export type GetCourseResponse = CourseDetail;
export type CourseEnrollmentResponse = CourseEnrollment;
export type GetCourseStatsResponse = CourseStats;
