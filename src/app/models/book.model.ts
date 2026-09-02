import { Pagination } from './common.model';

export interface Book {
  bookId?: number;
  title: string;
  author: string;
  language: string;
  subject: string;
  availableQuantity: number;
  publisher: string;
  publicationDate: string;
  totalQuantity: number;
  availableStatus: string | boolean;
  isbn: string;
}

export interface BookResponse {
  data: {
    books: Book[];
    pagination: Pagination;
    totalRecords?: number;
  };
}
