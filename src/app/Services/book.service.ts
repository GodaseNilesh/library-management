import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';
import { Book, BookResponse } from '../models/book.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private application: ApplicationService) {}

  saveBook(bookDetails: Book) {
    let url = environment.apiUrl + '/Book';
    return this.application.postData(url, bookDetails);
  }

  getAllBooks(filter: Record<string, string> = {}): Observable<BookResponse> {
    let url = environment.apiUrl + '/Book';
    return this.application.getData<BookResponse>(url, { params: filter });
  }

  getBookDetailsById(id: string):Observable<Book> {
    let url = environment.apiUrl + `/Book/${id}`;
    return this.application.getData<Book>(url);
  }

  updateBookById(bookId: number, bookDetails: Book) {
    let url = environment.apiUrl + `/Book/${bookId}`;
    return this.application.putData(url, bookDetails);
  }

  deleteBookById(id: number) {
    let url = environment.apiUrl + `/Book/${id}`;
    return this.application.deleteData(url);
  }

  exportAllBooksData() {
    let url = environment.apiUrl + '/Book/exportBooks';
    return this.application.exportData(url);
  }
}
