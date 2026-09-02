import { BloodGroup, Gender, Pagination, UserRole } from './common.model';

export interface Student {
  studentId?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  className: string;
  department: string;
  gender: Gender;
  dob: string;
  phone: string;
  admissionDate: string;
  yearSemester: string;
  rollNo: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  postalCode: string;
  libraryMembershipNo: string;
  bloodGroup: BloodGroup;
  status: boolean;
  role?: UserRole;
}

export interface StudentTableData extends Student {
  studentName: string;
  action: string;
  class: string;
}

export interface StudentResponse {
  students: Student[];
  pagination: Pagination;
}
