import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { IssuedBook, IssuedBookResponse, SaveIssuedBook, UpdateIssuedBook } from '../models/IssuedBook.model';

@Injectable({
  providedIn: 'root',
})
export class IssuedBookService {
  constructor(private application: ApplicationService) {}

  saveIssuedBook(bookDetails: SaveIssuedBook) {
    let url = environment.apiUrl + '/issue-book';
    return this.application.postData(url, bookDetails);
  }

  getAllIssuedBooks(
    bookId: string = '',
    userId: string = '',
  ): Observable<IssuedBookResponse> {
    const url = new URL(`${environment.apiUrl}/issue-book`);
    if (bookId) url.searchParams.set('bookId', bookId);
    if (userId) url.searchParams.set('userId', userId.toString());
    return this.application.getData<IssuedBookResponse>(url.toString());
  }

  updateIssuedBookById(bookDetails: UpdateIssuedBook) {
    let url =
      environment.apiUrl + '/issue-book/' + bookDetails.issueId + '/renew';
    return this.application.putData(url, bookDetails);
  }

  deleteIssuedBookById(issuedId: string) {
    let url = environment.apiUrl + '/issue-book/' + issuedId;
    return this.application.deleteData(url);
  }

  getIssuedBookById(issuedId: string):Observable<IssuedBook> {
    let url = environment.apiUrl + '/issue-book/' + issuedId;
    return this.application.getData<IssuedBook>(url);
  }

  returnBookById(issuedId: string, payload: { isFinePaid: boolean }) {
    let url = environment.apiUrl + '/issue-book/' + issuedId + '/return';
    return this.application.putData(url, payload);
  }
}
