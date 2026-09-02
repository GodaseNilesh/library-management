import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Observable,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Book, BookResponse } from 'src/app/models/book.model';
import { AllUsersResponse, IssuedBook } from 'src/app/models/IssuedBook.model';
import { CreateOrderData, CreateOrderResponse, PaymentSuccessResponse, verifyPaymentResponse } from 'src/app/models/payment.model';
import { IssueUser } from 'src/app/models/user.model';
import { BookService } from 'src/app/Services/book.service';
import { IssuedBookService } from 'src/app/Services/issued-book.service';
import { PaymentService } from 'src/app/Services/payment.service';
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
  AllBooksData: Book[] = [];
  allUsers: IssueUser[] = [];
  today = new Date();
  isLoading: boolean = false;
  quantityAvailable: number = 1;
  issuedBookId!: string;
  filteredOptions!: Book[];
  issuedDetails!: IssuedBook;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private issuedBookService: IssuedBookService,
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private toastr: ToastrService,
    private paymentService: PaymentService,
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
        next: (res: BookResponse) => {
          this.AllBooksData = res.data.books;
          this.filteredOptions = res.data.books;
        },
        error: (err) => {
          console.error(err);
        },
      });

    this.loadData();

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
        next: (res: AllUsersResponse) => {
          if ('teachers' in res) {
            this.allUsers = res.teachers?.map((user)=>{
              return{
                fullName: user.fullName || '',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                status: user.status,
                userId: user.userId || 0,
                teacherId: user.teacherId || 0,
                employeeId: user.employeeId,
              }
            });
          } else {
            this.allUsers = res.students.map((user)=>{
              return{
                fullName: user.fullName ?? '',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role ?? 'student',
                status: user.status,
                userId: user.userId ?? 0,
                studentId: user.studentId ?? 0,
                rollNo: user.rollNo,
              }
            });
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  loadData() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.issuedBookId = id;
        this.issuedBookService.getIssuedBookById(id).subscribe((book: IssuedBook) => {
          const bookInfo = book;
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
  }

  onBookSelected(bookName: string, bookId: number = 0) {
    let selectedBook: Book[] = this.AllBooksData.filter((book) => {
      return book.title == bookName;
    });
    this.issuedBookForm.patchValue({
      bookName: selectedBook.length ? selectedBook[0].title : bookName,
      bookId: selectedBook.length ? selectedBook[0].bookId : bookId,
    });
  }

  onUserSelected(userName: string) {
    const selectedUser = this.allUsers.find(
      (x) => x.fullName === userName,
    );
    if (!selectedUser) return;
    this.issuedBookForm.get('userId')?.setValue(selectedUser.userId);
  }

  onUserTypeChange(event: MatSelectChange) {
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

    const isDueDateValid =
      this.formatDateToLocalString(formValue.dueDate) >=
      this.formatDateToLocalString(this.today);
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
        issueId: Number(this.issuedBookId),
        dueDate:
          typeof formValue.dueDate == 'string'
            ? formValue.dueDate
            : this.formatDateToLocalString(formValue.dueDate),
      };

      const isDuedateUpdate =
        reqBody.dueDate ===
        this.formatDateToLocalString(new Date(this.issuedDetails.due_date));
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

  returnIssuedBook(finePaid: boolean = false) {
    const reqBody = {
      isFinePaid: finePaid,
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

  payFineNow() {
    this.isLoading = true;
    this.paymentService.createOrder(Number(this.issuedBookId)).subscribe({
      next: (response: CreateOrderResponse) => {
        console.log(response);
        this.openCheckout(response.data);
      },
      error: (error: Error) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }

  openCheckout(order: CreateOrderData) {
    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: 'The Best Library',
      description: 'Overdue fine payment',
      order_id: order.orderId,
      handler: (response: PaymentSuccessResponse) => {
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          issued_id: Number(this.issuedBookId),
        };

        this.toastr.info(`Payment of ₹${order.amount / 100} successfully`);
        this.paymentService.verifyPayment(paymentData).subscribe({
          next: (result: verifyPaymentResponse) => {
            this.isLoading = false;
            if (this.issuedDetails.return_date === null) {
              this.returnIssuedBook(true);
              return;
            }
            this.router.navigate(['issue-book-history']);
          },
          error: (error: Error) => {
            this.isLoading = false;
            this.toastr.info(`Payment verification failed`);
            console.error('Payment verification failed:', error);
          },
        });
      },
      modal: {
        ondismiss: () => {
          this.isLoading = false;
          this.toastr.warning('Payment cancelled');
        },
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#1976d2',
      },
    };

    const razoppay = new Razorpay(options);
    razoppay.open();
  }
}
