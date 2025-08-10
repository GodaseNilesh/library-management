import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { BookService } from 'src/app/Services/book.service';
import { IssuedBookService } from 'src/app/Services/issued-book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  isLoading: boolean = false;
  bookDetailsForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private fb: FormBuilder,
    private issuedBookService: IssuedBookService
  ) {
    this.bookDetailsForm = this.fb.group({
      bookTitle: new FormControl(''),
      subject: new FormControl(''),
      language: new FormControl(''),
      totalQuantity: new FormControl(''),
      availableQuantity: new FormControl(''),
    });
  }

  StudentData = [];

  StudentDataColumns = [
    { columnDef: 'issueId', header: 'Issue Id' },
    { columnDef: 'userName', header: 'User Name' },
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'issueDate', header: 'Issue Date' },
    { columnDef: 'dueDate', header: 'Due Date' },
    { columnDef: 'status', header: 'Status' },
    // { columnDef: 'action', header: 'Action' },
  ];

  studentsDisplayedColumns = this.StudentDataColumns.map((c) => c.columnDef);
  studentsDataSource: any = this.StudentData;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      id &&
        forkJoin(
          this.bookService.getBookDetailsById(id).pipe(map((book) => [book])),
          this.issuedBookService.getAllIssuedBooks(id)
        ).subscribe((res) => {
          console.log(res);

          //patch book information
          let bookInfo: any = res[0][0];
          this.bookDetailsForm.patchValue({
            bookTitle: bookInfo.title,
            subject: bookInfo.subject,
            language: bookInfo.language,
            totalQuantity: bookInfo.totalQuantity,
            availableQuantity: bookInfo.availableQuantity,
          });

          this.studentsDataSource = res[1];
        });
    });
  }
}
