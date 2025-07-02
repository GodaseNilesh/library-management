import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssuedBookService } from 'src/app/Services/issued-book.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-book-issue-history',
  templateUrl: './book-issue-history.component.html',
  styleUrls: ['./book-issue-history.component.css'],
})
export class BookIssueHistoryComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private issuedBookService: IssuedBookService,
    private dialog: MatDialog
  ) {}
  // For issued book list
  issueBookRecords: any[] = [];
  issuedBooksDataSource: any[] = [];
  issuedBookDataColumns = [
    { columnDef: 'issueId', header: 'ID' },
    { columnDef: 'userName', header: 'User Name' },
    { columnDef: 'userType', header: 'user Type' },
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'bookName', header: 'Book Name' },
    { columnDef: 'issueDate', header: 'Issue Date' },
    { columnDef: 'dueDate', header: 'Due Date' },
    { columnDef: 'quantity', header: 'Quantity' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'action', header: 'Action' },
  ];

  issuedBooksDisplayedColumns = this.issuedBookDataColumns.map(
    (c) => c.columnDef
  );

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.issuedBookService.getAllIssuedBooks().subscribe(
      (res: any) => {
        this.issueBookRecords = res;
        this.issueBookRecords = this.issueBookRecords.map((x: any) => {
          x.action = 'edit,delete,details';
          return x;
        });
        this.issuedBooksDataSource = this.issueBookRecords;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.issuedBooksDataSource = [...this.issueBookRecords];
    } else {
      const filtered = this.issueBookRecords.filter((book: any) =>
        Object.values(book).some((val: any) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.issuedBooksDataSource = [...filtered];
    }
  }
  onEditClicked(event: any) {
    console.log(event);
    // this.router.navigate([`book-list/add-book/${event.bookId}`]);
  }
  onDeleteClicked(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Confirm!',
        message: 'Do you want delete this record?',
        action: {
          cancel: true,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.isLoading = true;
        this.issuedBookService.deleteIssuedBookById(event.issueId).subscribe(
          (res: any) => {
            console.log(res);
            this.loadData();
          },
          (err: any) => {
            console.log(err);
          }
        );
        this.isLoading = false;
      }
    });
  }
  onDetailsClicked(event: any) {
    console.log(event);
    // this.router.navigate([`student-list/student-details/${event.studentId}`]);
  }
}
