import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private applicationService: ApplicationService) {}

  getUserDistribution() {
    let url = environment.apiUrl + '/reports/user-distribution';
    return this.applicationService.getData(url);
  }

  getBookDistribution() {
    let url = environment.apiUrl + '/reports/book-distribution';
    return this.applicationService.getData(url);
  }

  getSummary() {
    let url = environment.apiUrl + '/reports/summary';
    return this.applicationService.getData(url);
  }

  getMonthlyIssuedBooks() {
    let url = environment.apiUrl + '/reports/monthly-issued-books';
    return this.applicationService.getData(url);
  }

  getIssuedReturnedOverdueBooks() {
    let url = environment.apiUrl + '/reports/monthly-library-activity';
    return this.applicationService.getData(url);
  }
}
