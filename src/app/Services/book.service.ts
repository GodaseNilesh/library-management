import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private application: ApplicationService) {}

  saveBook(bookDetails: any) {
    let url = environment.apiUrl + '/Book';
    return this.application.postData(url, bookDetails);
  }
  getAllBooks() {
    let url = environment.apiUrl + '/Book';
    return this.application.getData(url);
  }
  getBookDetailsById(id: string) {
    let url = environment.apiUrl + `/Book/${id}`;
    return this.application.getData(url);
  }
  updateBookById(bookDetails: any) {
    let url = environment.apiUrl + `/Book/${bookDetails.bookId}`;
    return this.application.putData(url, bookDetails);
  }
  deleteBookById(id: string) {
    let url = environment.apiUrl + `/Book/${id}`;
    return this.application.deleteData(url);
  }

  exportAllBooksData() {
    let url = environment.apiUrl + '/Book/exportBooks';
    return this.application.getData(url, { responseType: 'blob' as 'blob' });
  }
}
