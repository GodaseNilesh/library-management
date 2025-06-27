import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/Services/book.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent {
  constructor(
    private router: Router,
    private bookService: BookService,
    private dialog: MatDialog
  ) {}
  booksData: any[] = [];
  bookDataColumns = [
    { columnDef: 'bookId', header: 'Book ID' },
    { columnDef: 'title', header: 'Book Name' },
    { columnDef: 'language', header: 'Language' },
    { columnDef: 'author', header: 'Author' },
    { columnDef: 'publisher', header: 'Publisher' },
    { columnDef: 'isbn', header: 'ISBN' },
    { columnDef: 'subject', header: 'Subject' },
    { columnDef: 'availableStatus', header: 'Status' },
    { columnDef: 'availableQuantity', header: 'Available Quantity' },
    { columnDef: 'totalQuantity', header: 'Total Quantity' },
    { columnDef: 'action', header: 'Action' },
  ];

  booksDisplayedColumns = this.bookDataColumns.map((c) => c.columnDef);
  booksDataSource = this.booksData;

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.bookService.getAllBooks().subscribe((res: any) => {
      this.booksData = res;
      this.booksData = this.booksData.map((x: any) => {
        x.action = 'edit,delete,details';
        x.availableStatus = x.availableStatus ? 'Available' : 'Unavailable';
        return x;
      });
      this.booksDisplayedColumns = this.bookDataColumns.map((c) => c.columnDef);
      this.booksDataSource = this.booksData;
    });
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.booksDataSource = [...this.booksData];
    } else {
      const filtered = this.booksData.filter((book) =>
        Object.values(book).some((val:any) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.booksDataSource = [...filtered];
    }
  }
  onEditClicked(event: any) {
    this.router.navigate([`book-list/add-book/${event.bookId}`]);
  }
  onDetailsClicked(event: any) {
    console.log(event);
    // this.router.navigate([`student-list/student-details/${event.studentId}`]);
  }
  onDeleteClicked(event: any) {
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
        this.bookService.deleteBookById(event.bookId).subscribe(
          (res) => {
            this.loadData();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }
}
