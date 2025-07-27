import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class IssuedBookService {
  constructor(private application: ApplicationService) {}

  saveIssuedBook(bookDetails: any) {
    let url = environment.apiUrl + '/BookIssue';
    return this.application.postData(url, bookDetails);
  }

  getAllIssuedBooks() {
    let url = environment.apiUrl + '/BookIssue';
    return this.application.getData(url);
  }

  updateIssuedBookById(bookDetails: any) {
    let url = environment.apiUrl + '/BookIssue/' + bookDetails.issueId;
    return this.application.putData(url, bookDetails);
  }

  deleteIssuedBookById(issuedId:string) {
    let url = environment.apiUrl + '/BookIssue/'+issuedId;
    return this.application.deleteData(url);
  }

  getIssuedBookById(issuedId: string) {
    let url = environment.apiUrl + '/BookIssue/' + issuedId;
    return this.application.getData(url);
  }
}
