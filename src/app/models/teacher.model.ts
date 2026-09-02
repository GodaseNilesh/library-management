import { Pagination, UserRole } from './common.model';

export interface Teacher {
  userId?: number;
  teacherId?: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNo: string;
  department: string;
  employeeId: string;
  joiningDate: Date;
  designation: string;
  status: boolean;
  role: UserRole;
  password?: string;
}

export interface TeacherResponse {
  teachers: Teacher[];
  pagination: Pagination;
}
