import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class IssuedBookService {
  constructor(private application: ApplicationService) {}

  saveIssuedBook(bookDetails: any) {
    let url = environment.apiUrl + '/issue-book';
    return this.application.postData(url, bookDetails);
  }

  // getAllIssuedBooks(bookId: string = '', userId: number = 0) {
  //   let url = environment.apiUrl + '/BookIssue';
  //   return this.application.getData(url);
  // }

  getAllIssuedBooks(bookId: string = '', userId: string = '') {
    const url = new URL(`${environment.apiUrl}/issue-book`);
    if (bookId) url.searchParams.set('bookId', bookId);
    if (userId) url.searchParams.set('userId', userId.toString());
    return this.application.getData(url.toString());
  }

  updateIssuedBookById(bookDetails: any) {
    let url = environment.apiUrl + '/issue-book/' + bookDetails.issueId + '/renew';
    return this.application.putData(url, bookDetails);
  }

  deleteIssuedBookById(issuedId:string) {
    let url = environment.apiUrl + '/issue-book/'+issuedId;
    return this.application.deleteData(url);
  }

  getIssuedBookById(issuedId: string) {
    let url = environment.apiUrl + '/issue-book/' + issuedId;
    return this.application.getData(url);
  }

  returnBookById(issuedId: string, payload: any) {
    let url = environment.apiUrl + '/issue-book/' + issuedId + '/return';
    return this.application.putData(url, payload);
  }
}
