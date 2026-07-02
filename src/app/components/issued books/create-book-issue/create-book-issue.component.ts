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
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, filter, finalize, map, Observable, startWith, switchMap, tap } from 'rxjs';
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
  allUsers: any = [];
  today = new Date();
  isLoading: boolean = false;
  quantityAvailable: number = 1;
  issuedBookId!: string;
  filteredOptions: any;
  issuedDetails: any;
  isFineCollected: any = new FormControl(null);
  showFineCollectedError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private issuedBookService: IssuedBookService,
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private toastr:ToastrService
  ) {
    this.issuedBookForm = this.fb.group({
      bookName: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      bookId: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      userType: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      userId: new FormControl(''),
      issueDate: new FormControl({ value: new Date(), disabled: true }, [
        Validators.required,
      ]),
      dueDate: new FormControl(new Date(), [Validators.required]),
      issuedQuantity: new FormControl({ value: 1, disabled: true }, [
        Validators.required,
        this.quantityValidator.bind(this),
      ]),
      issuedStatus: new FormControl({ value: 'Issued', disabled: true }, [
        Validators.required,
      ]),
    });
  }

  ngOnInit() {
    this.searchBookCtrl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => (this.isLoading = true)),
        switchMap((value) => {
          const filter = {
            title: value || '',
          };

          return this.bookService
            .getAllBooks(filter)
            .pipe(finalize(() => (this.isLoading = false)));
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.AllBooksData = res.data.books;
          this.filteredOptions = res.data.books;
        },
        error: (err) => {
          console.error(err);
        },
      });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.issuedBookId = id;
        this.issuedBookService.getIssuedBookById(id).subscribe((book: any) => {
          const bookInfo = book.data;
          this.issuedDetails = bookInfo;
          this.searchBookCtrl.setValue(bookInfo.book_title);
          this.onBookSelected(bookInfo.book_title, bookInfo.book_id);
          this.issuedBookForm.patchValue({
            bookId: bookInfo.book_id,
            userType: bookInfo.role,
            userName: bookInfo.full_name,
            issueDate: new Date(bookInfo.issue_date),
            dueDate: new Date(bookInfo.due_date),
            issuedQuantity: 1,
            issuedStatus: bookInfo.status,
          });
          this.issuedBookForm.get('userType')?.disable();
          this.issuedBookForm.get('userName')?.disable();
          this.searchBookCtrl.disable();
          if (bookInfo.return_date)
            this.issuedBookForm.get('dueDate')?.disable();
        });
      }
    });

    this.issuedBookForm
      .get('userName')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => (this.isLoading = true)),
        switchMap((value) => {
          const filter = {
            email: value || '',
          };

          if (this.issuedBookForm.get('userType')?.value === 'teacher') {
            return this.teacherService
              .getAllTeachers(filter)
              .pipe(finalize(() => (this.isLoading = false)));
          } else {
            return this.studentService
              .getAllStudents(filter)
              .pipe(finalize(() => (this.isLoading = false)));
          }
        }),
      )
      .subscribe({
        next: (res: any) => {
          if (this.issuedBookForm.get('userType')?.value === 'teacher') {
            this.allUsers = res.data.teachers;
          } else {
            this.allUsers = res.data.students;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onBookSelected(bookName: string, bookId: number = 0) {
    let selectedBook: any = this.AllBooksData.filter((book) => {
      return book.title == bookName;
    });
    this.issuedBookForm.patchValue({
      bookName: selectedBook.length ? selectedBook[0].title : bookName,
      bookId: selectedBook.length ? selectedBook[0].bookId : bookId,
    });
  }

  onUserSelected(userName: string) {
    const selectedUser = this.allUsers.find(
      (x: any) => x.full_name === userName,
    );
    this.issuedBookForm.get('userId')?.setValue(selectedUser.userId);
  }

  onUserTypeChange(event: any) {
    this.allUsers = [];
    this.issuedBookForm.get('userName')?.setValue('');
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
    let formValue = this.issuedBookForm.getRawValue();
    const closeRenewModalBtn = document.getElementById('closeRenewBookModal');

    const isDueDateValid = this.formatDateToLocalString(formValue.dueDate) >= this.formatDateToLocalString(this.today);
    if (!isDueDateValid) {
      this.toastr.info('Please select valid due date.');
      return;
    }

    if (!this.issuedBookId) {
      const reqBody = {
        bookId: formValue.bookId,
        userId: formValue.userId,
        dueDate:
          typeof formValue.dueDate == 'string'
            ? formValue.dueDate
            : this.formatDateToLocalString(formValue.dueDate),
        remarks: '',
      };
      this.issuedBookService.saveIssuedBook(reqBody).subscribe(
        (res) => {
          this.router.navigate(['issue-book-history']);
        },
        (err) => {
          console.error(err);
        },
      );
    } else {
      const reqBody = {
        issueId: this.issuedBookId,
        dueDate:
        typeof formValue.dueDate == 'string'
        ? formValue.dueDate
        : this.formatDateToLocalString(formValue.dueDate),
      };

      const isDuedateUpdate = reqBody.dueDate === this.formatDateToLocalString(new Date(this.issuedDetails.due_date));
      if (isDuedateUpdate) {
        this.toastr.info('Due date is unchanged.');
        closeRenewModalBtn?.click();
        return;
      }

      this.issuedBookService.updateIssuedBookById(reqBody).subscribe(
        (res) => {
          this.router.navigate(['issue-book-history']);
          closeRenewModalBtn?.click();
        },
        (err) => {
          console.error(err);
          closeRenewModalBtn?.click();
        },
      );
    }
  }

  returnIssuedBook() {
    const isFineCollected = this.isFineCollected.value;
    if (isFineCollected === null && this.issuedDetails?.is_overdue) {
      this.showFineCollectedError = true;
      return;
    }
    const reqBody = {
      isFinePaid: isFineCollected || 0,
      fineAmount: this.issuedDetails.fine_amount,
    };

    const closeModalBtn = document.getElementById('closeReturnBookModal');

    this.issuedBookService.returnBookById(this.issuedBookId, reqBody).subscribe(
      (res) => {
        console.log(res);
        closeModalBtn?.click();
        this.router.navigate(['issue-book-history']);
      },
      (err) => {
        console.log(err);
        closeModalBtn?.click();
      },
    );
  }
}
