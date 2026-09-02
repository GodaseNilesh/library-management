import { Pagination } from './common.model';
import { Student, StudentResponse } from './student.model';
import { Teacher, TeacherResponse } from './teacher.model';

export interface IssuedBook {
  id?: number;
  issue_id: number;
  issue_date: string;
  due_date: string;
  return_date: null | string;
  fine_amount: number;
  fine_paid: boolean | string;
  remarks: string;
  created_at: string;
  book_id: number;
  book_title: string;
  isbn: string;
  user_id: number;
  user_name: string;
  full_name: string;
  role: string;
  email: string;
  issued_by_id: number;
  issued_by_name: string;
  is_overdue: number;
  overdue_days: number;
  status: string;
}

export interface IssuedBookTable extends IssuedBook {
  action: string;
}

export interface IssuedBookResponse {
  data: IssuedBook[];
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface SaveIssuedBook {
  bookId: number;
  userId: number;
  dueDate: string;
  remarks: string;
}

export interface UpdateIssuedBook {
  dueDate: string;
  issueId?: number;
}

export type AllUsersResponse = TeacherResponse | StudentResponse;
