import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Observable, startWith, tap } from 'rxjs';
import { BookService } from 'src/app/Services/book.service';
import { IssuedBookService } from 'src/app/Services/issued-book.service';
import { StudentService } from 'src/app/Services/student.service';
import { TeacherService } from 'src/app/Services/teacher.service';

@Component({
  selector: 'app-create-book-issue',
  templateUrl: './create-book-issue.component.html',
  styleUrls: ['./create-book-issue.component.css'],
})
export class CreateBookIssueComponent {
  issuedBookForm: FormGroup;
  searchBookCtrl = new FormControl('');
  AllBooksData: any[] = [];
  allUsers: any;
  today = new Date();
  isLoading: boolean = false;
  quantityAvailable: number = 1;
  issuedBookId!: string;
  filteredOptions: Observable<any[]> | undefined;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private issuedBookService: IssuedBookService,
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private teacherService: TeacherService
  ) {
    this.issuedBookForm = this.fb.group({
      bookName: new FormControl('', [Validators.required]),
      bookId: new FormControl('', [Validators.required]),
      userType: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      issueDate: new FormControl(new Date(), [Validators.required]),
      dueDate: new FormControl(new Date(), [Validators.required]),
      issuedQuantity: new FormControl(1, [Validators.required,this.quantityValidator.bind(this)]),
      issuedStatus: new FormControl('pending', [Validators.required]),
    });
  }


  ngOnInit() {
    this.bookService.getAllBooks().subscribe((res: any) => {
      this.AllBooksData = res;
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.issuedBookId = id;
        this.issuedBookService.getIssuedBookById(id).subscribe((book: any) => {
          let title = this.AllBooksData.filter((x) => {
            return x.bookId == book.bookId;
          })[0].title ?? '';
          this.onBookSelected(title);
          this.issuedBookForm.patchValue({
            bookId: book.bookId,
            userType: book.userType,
            userName: book.userName,
            issueDate: new Date(book.issueDate),
            dueDate: new Date(book.dueDate),
            issuedQuantity: book.quantity,
            issuedStatus: book.status,
          });
          this.searchBookCtrl.setValue(title);
        });
      }
    });

    this.filteredOptions = this.searchBookCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.AllBooksData))
    );

    this.allUsers = this.issuedBookForm.get('userName')?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '', this.allUsers as any))
    );

    this.issuedBookForm.get('userType')?.valueChanges.subscribe((userType) => {
      if (userType === 'teacher') {
        this.teacherService.getAllTeachers().subscribe((allTeachers: any) => {
          this.allUsers = allTeachers.map((x: any) => {
            x.fullName = x.firstName + ' ' + x.lastName;
            return x;
          });
        });
      } else if (userType === 'student') {
        this.studentService.getAllStudents().subscribe((allStudents: any) => {
          this.allUsers = allStudents.map((x: any) => {
            x.fullName = x.firstName + ' ' + x.lastName;
            return x;
          });
        });
      }
    });
  }

  private _filter(
    value: string, data:any[]=[]
  ): { id: number; name: string; email: string; contactNo: string }[] {
    const filterValue = value.toLowerCase();

    return data.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }
  onBookSelected(bookName: string) {
    let selectedBook: any = this.AllBooksData.filter((book) => {
      return book.title == bookName;
    });

    this.quantityAvailable = selectedBook[0].availableQuantity;
    this.issuedBookForm.patchValue({
      bookName: selectedBook[0].title,
      bookId: selectedBook[0].bookId,
      // issuedQuantity: selectedBook[0].availableQuantity,
    });
  }

  quantityValidator(control: AbstractControl): ValidationErrors | null {
    if (Number(control.value) > Number(this.quantityAvailable)) {
      return { quantityExceeded: true };
    }
    return null;
  }

  formatDateToLocalString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  saveIssuedBook() {
    let formValue = this.issuedBookForm.value;
    const reqBody = {
      issueId: this.issuedBookId || 0,
      // bookName: formValue.bookName,
      bookId: formValue.bookId,
      userType: formValue.userType,
      userName: formValue.userName,
      issueDate:
        typeof formValue.issueDate == 'string'
          ? formValue.issueDate
          : this.formatDateToLocalString(formValue.issueDate),
      dueDate:
        typeof formValue.dueDate == 'string'
          ? formValue.dueDate
          : this.formatDateToLocalString(formValue.dueDate),
      quantity: formValue.issuedQuantity,
      status: formValue.issuedStatus,
    };
    if (!this.issuedBookId) {
      this.issuedBookService.saveIssuedBook(reqBody).subscribe(
        (res) => {
          this.router.navigate(['issue-book-history']);
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.issuedBookService.updateIssuedBookById(reqBody).subscribe(
        (res) => {
          this.router.navigate(['issue-book-history']);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }
}
