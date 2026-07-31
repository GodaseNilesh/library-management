import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IssuedBookService } from 'src/app/Services/issued-book.service';

@Component({
  selector: 'app-fines',
  templateUrl: './fines.component.html',
  styleUrls: ['./fines.component.css'],
})
export class FinesComponent {
  isLoading: boolean = false;
  totalFine: number = 0;
  collectedFine: number = 0;
  pendingFine: number = 0;

  issueBookRecords: any[] = [];
  issuedBooksDataSource: any[] = [];
  issuedBookDataColumns = [
    { columnDef: 'issue_id', header: 'ID' },
    { columnDef: 'book_title', header: 'Book Name' },
    { columnDef: 'user_name', header: 'Borrower Name' },
    // { columnDef: 'role', header: 'user Type' },
    { columnDef: 'issue_date', header: 'Issue Date' },
    { columnDef: 'due_date', header: 'Due Date' },
    { columnDef: 'return_date', header: 'Return Date' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'overdue_days', header: 'Overdue(Days)' },
    { columnDef: 'fine_amount', header: 'Fine Amount()' },
    { columnDef: 'fine_paid', header: 'Fine Paid' },
    { columnDef: 'action', header: 'Action' },
  ];

  constructor(
    private issuedBookService: IssuedBookService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.issuedBookService.getAllIssuedBooks().subscribe((issuedBooks: any) => {
      this.issueBookRecords = issuedBooks.data;
      this.issueBookRecords = this.issueBookRecords.map((x: any) => {
        x.action = 'details';
        x.issue_date = new Date(x.issue_date)
          .toLocaleDateString('en-GB')
          .replace(/\//g, '-');
        x.due_date = new Date(x.due_date)
          .toLocaleDateString('en-GB')
          .replace(/\//g, '-');
        x.return_date = x.return_date ? new Date(x.return_date)
          .toLocaleDateString('en-GB')
          .replace(/\//g, '-') : '-';
        x.fine_paid = x.fine_amount > 0 ? (x.fine_paid ? 'Paid' : 'Unpaid') : 'N/A';
        return x;
      });

      this.totalFine = this.issueBookRecords
        .map((record) => record.fine_amount)
        .reduce((acc, curr) => {
          return acc + curr;
        });

      this.collectedFine = this.issueBookRecords
        .filter((record) => record.fine_paid !== 'Unpaid')
        .map((record) => record.fine_amount)
        .reduce((acc, curr) => {
          return acc + curr;
        });

      this.pendingFine = this.issueBookRecords
        .filter((record) => record.fine_paid === 'Unpaid')
        .map((record) => record.fine_amount)
        .reduce((acc, curr) => {
          return acc + curr;
        });

      this.issuedBooksDataSource = this.issueBookRecords;
      this.isLoading = false;
    });
  }

  goToDetails(row: any) {
    this.router.navigate([
      `issue-book-history/create-book-issue/${row.issue_id}`,
    ]);
  }
}
