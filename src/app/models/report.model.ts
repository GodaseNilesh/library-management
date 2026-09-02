import { UserRole } from "./common.model";

export interface SummaryDetail {
  totalBooks: number;
  activeUsers: number;
  issuedToday: number;
  overdueBooks: number;
  pendingFine: number;
}

export interface UserRoleCountDistribution {
  role: UserRole;
  count: number;
}

export interface SubjectCount {
  subject: string;
  count: number;
}

export interface MonthlyIssued {
  monthNumber: number;
  month: string;
  totalIssued: number;
}

export interface MonthlyBookStats {
  monthNumber: number;
  month: string;
  issued: number;
  returned: number;
  overdue: number;
}
