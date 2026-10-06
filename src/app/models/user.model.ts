import { UserRole } from "./common.model";

export interface LoginResponse {
  message: string;
  token: string;
  expiresAt: string;
  user: {
    userId: string;
    email: string;
    role: string;
    userName: string;
    status: string;
  };
}

export interface signUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
}

export interface UpdateUser {
  userRole: string;
  status: string;
  userId: number;
}

export interface AssignRoleToUsers {
  roleName: string;
  addedUserIds: number[];
  removedUserIds: number[];
}

export interface User {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: UserRole;
  status: string;
  userId: number;
  studentId?: number;
  teacherId?: number;
  lastUpdatedAt?: string;
  createdOn?: string;
  action?: string;
}

export interface IssueUser {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: UserRole;
  status: boolean;
  userId: number;
  studentId?: number;
  teacherId?: number;
  lastUpdatedAt?: string;
  createdOn?: string;
  action?: string;
  employeeId?: string;
  rollNo?: string;
}

export interface Role {
  roleId: number;
  roleName: string;
  usersAssigned: number;
  action: string;
}

export type RolesCount = Record<UserRole, number>;

export interface PendingRequest {
  userId: string;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface RecentActivity {
  activity_id?: number;
  activity_type: string;
  created_at: string;
  performed_by_id?: number;
  performed_by_name: string;
  description: string;
  role: string;
}
