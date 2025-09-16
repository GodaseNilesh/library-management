import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { BookService } from 'src/app/Services/book.service';
import { LoginService } from 'src/app/Services/login.service';
import { StudentService } from 'src/app/Services/student.service';
import { TeacherService } from 'src/app/Services/teacher.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  studentCount: number = 0;
  teacherCount: number = 0;
  booksCount: number = 0;
  availableBooksCount: number = 0;

  allBooksData: any = [];
  allAuthorsData: any[] = [];
  private _formBuilder = inject(FormBuilder);
  
    options = this._formBuilder.group({
      bottom: 0,
      fixed: false,
      top: 0,
    });

  bookDataSource: any[] = [];
  booksDisplayedColumns: any[] = [];

  authorsDataSource: any[] = [];
  authorsDisplayedColumns: any[] = [];

    BookDataColumns = [
      { columnDef: 'id', header: 'ID' },
      { columnDef: 'title', header: 'Title' },
      { columnDef: 'author', header: 'Author' },
      { columnDef: 'subject', header: 'Subject' },
      { columnDef: 'language', header: 'Language' },
      { columnDef: 'publisher', header: 'Publisher' },
      { columnDef: 'availableQuantity', header: 'Available Qty.' },
  ];

  AuthorDataColumns = [
    { columnDef: 'id', header: 'ID' },
    { columnDef: 'name', header: 'Author Name' },
  ];

  constructor(
    public loginService: LoginService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    forkJoin(
      this.studentService.getAllStudents(),
      this.teacherService.getAllTeachers(),
      this.bookService.getAllBooks()
    ).subscribe(([studentRes, teacherRes, booksRes]: any) => {
      this.studentCount = studentRes.length;
      this.teacherCount = teacherRes.length;
      this.booksCount = booksRes.length;
      this.allBooksData = booksRes.map((x: any, index: number) => ({
        ...x,
        id: index + 1,
      }));

      this.booksDisplayedColumns = this.BookDataColumns.map((c) => c.columnDef);
      this.bookDataSource = this.allBooksData;

      this.authorsDisplayedColumns = this.AuthorDataColumns.map(
        (c) => c.columnDef
      );
      this.authorsDataSource = this.allBooksData.map((x: any) => ({
        id: x.id,
        name: x.author,
      }));
    });
  }
}
