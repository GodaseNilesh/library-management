import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/Services/book.service';
import { CommonDialogComponent } from '../../Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Book, BookResponse } from 'src/app/models/book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent {
  constructor(
    private router: Router,
    private bookService: BookService,
    private dialog: MatDialog,
  ) {}
  booksData: Book[] = [];
  bookDataColumns = [
    { columnDef: 'bookId', header: 'Book ID' },
    { columnDef: 'title', header: 'Book Name' },
    { columnDef: 'language', header: 'Language' },
    // { columnDef: 'author', header: 'Author' },
    { columnDef: 'isbn', header: 'ISBN' },
    { columnDef: 'subject', header: 'Subject' },
    { columnDef: 'isActive', header: 'Active' },
    { columnDef: 'availableStatus', header: 'Available Status' },
    { columnDef: 'availableQuantity', header: 'Available Quantity' },
    { columnDef: 'totalQuantity', header: 'Total Quantity' },
    { columnDef: 'action', header: 'Action' },
  ];

  booksDisplayedColumns = this.bookDataColumns.map((c) => c.columnDef);
  booksDataSource = this.booksData;
  showExportOptions: boolean = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.bookService.getAllBooks().subscribe((res: BookResponse) => {
      this.booksData = res.data.books;
      this.booksData = this.booksData.map((x: Book) => {
        return{
          ...x,
          action: x.isActive ? 'edit,deactivate,details' : 'edit,activate,details',
          availableStatus: x.availableStatus ? 'Available' : 'Unavailable',
          isActive: x.isActive ? 'Active' : 'Inactive',
        }
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
        Object.values(book).some((val) =>
          val.toString().toLowerCase().includes(value),
        ),
      );
      this.booksDataSource = [...filtered];
    }
  }

  onEditClicked(event: Book) {
    this.router.navigate([`book-list/add-book/${event.bookId}`]);
  }

  onDetailsClicked(event: Book) {
    this.router.navigate([`book-list/book-details/${event.bookId}`]);
  }

  onDeactivateClicked(event: Book) {
    const bookId = event.bookId;
    if(!bookId) return;

    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Deactivate Book?',
        message: `This book will no longer be available for issuing.\n Existing records and history will be preserved.`,
        action: {
          cancel: true,
          deactivate: true
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'deactivate') {
        const book = event;
        book.isActive = false;
        book.availableStatus = book.availableStatus === 'Available';
        this.bookService.updateBookById(bookId, book).subscribe(
          (res) => {
            this.loadData();
          },
          (err) => {
            console.log(err);
          },
        );
      }
    });
  }

  onActivateClicked(event: Book) {
    const bookId = event.bookId;
    if(!bookId) return;

    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Activate Book?',
        message: `This book will be available for issuing again.\n Existing records and history will be preserved.`,
        action: {
          cancel: true,
          activate: true
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'activate') {
        const book = event;
        book.isActive = true;
        book.availableStatus = book.availableStatus === 'Available';
        this.bookService.updateBookById(bookId, book).subscribe(
          (res) => {
            this.loadData();
          },
          (err) => {
            console.log(err);
          },
        );
      }
    });
  }

  onImportExportOptionChange(type: string, value: string) {
    if (type === 'import') {
      if (value === 'excel') {
      }
    } else if (type === 'export') {
      if (value === 'excel') {
        this.bookService.exportAllBooksData().subscribe((res) => {
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const now = new Date();
          const fileName = `books_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.xlsx`;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    }
  }
}
