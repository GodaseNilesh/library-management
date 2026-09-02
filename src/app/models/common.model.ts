import { HttpHeaders } from '@angular/common/http';

export type Gender = 'Male' | 'Female' | 'Other';

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export type UserRole = 'admin' | 'librarian' | 'student' | 'teacher' | 'user';
