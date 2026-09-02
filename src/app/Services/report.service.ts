import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { MonthlyBookStats, MonthlyIssued, SubjectCount, SummaryDetail, UserRoleCountDistribution } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private applicationService: ApplicationService) {}

  getUserDistribution(): Observable<UserRoleCountDistribution[]> {
    let url = environment.apiUrl + '/reports/user-distribution';
    return this.applicationService.getData<UserRoleCountDistribution[]>(url);
  }

  getBookDistribution(): Observable<SubjectCount[]> {
    let url = environment.apiUrl + '/reports/book-distribution';
    return this.applicationService.getData<SubjectCount[]>(url);
  }

  getSummary():Observable<SummaryDetail[]> {
    let url = environment.apiUrl + '/reports/summary';
    return this.applicationService.getData<SummaryDetail[]>(url);
  }

  getMonthlyIssuedBooks():Observable<MonthlyIssued[]> {
    let url = environment.apiUrl + '/reports/monthly-issued-books';
    return this.applicationService.getData<MonthlyIssued[]>(url);
  }

  getIssuedReturnedOverdueBooks():Observable<MonthlyBookStats[]> {
    let url = environment.apiUrl + '/reports/monthly-library-activity';
    return this.applicationService.getData<MonthlyBookStats[]>(url);
  }
}
