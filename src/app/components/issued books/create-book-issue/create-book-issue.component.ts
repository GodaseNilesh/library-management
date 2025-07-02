import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { BookService } from 'src/app/Services/book.service';
import { IssuedBookService } from 'src/app/Services/issued-book.service';

@Component({
  selector: 'app-create-book-issue',
  templateUrl: './create-book-issue.component.html',
  styleUrls: ['./create-book-issue.component.css'],
})
export class CreateBookIssueComponent {
  issuedBookForm: FormGroup;
  searchBookCtrl = new FormControl('');
  AllBooksData: any[] = [];
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private issuedBookService: IssuedBookService
  ) {
    this.issuedBookForm = this.fb.group({
      bookName: new FormControl('', [Validators.required]),
      bookId: new FormControl('', [Validators.required]),
      userType: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      issuedDate: new FormControl(new Date(), [Validators.required]),
      dueDate: new FormControl(new Date(), [Validators.required]),
      issuedQuantity: new FormControl('', [Validators.required]),
      issuedStatus: new FormControl('pending', [Validators.required]),
    });
  }

  filteredOptions: Observable<any[]> | undefined;

  ngOnInit() {
    this.bookService.getAllBooks().subscribe((res: any) => {
      this.AllBooksData = res;
    });

    this.filteredOptions = this.searchBookCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(
    value: string
  ): { id: number; name: string; email: string; contactNo: string }[] {
    const filterValue = value.toLowerCase();

    return this.AllBooksData.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }
  onBookSelected(bookName: string) {
    let selectedBook: any = this.AllBooksData.filter((book) => {
      return book.title == bookName;
    });

    this.issuedBookForm.patchValue({
      bookName: selectedBook[0].title,
      bookId: selectedBook[0].bookId,
      issuedQuantity: selectedBook[0].availableQuantity,
    });
  }
  saveIssuedBook() {
    console.log(this.issuedBookForm.value);
    const reqBody = {
      issueId: 0,
      bookName: 'string',
      bookId: 0,
      userType: 'string',
      userName: 'string',
      issueDate: '2025-06-29',
      dueDate: '2025-06-29',
      quantity: 0,
      status: 'string',
    };
    this.issuedBookService.saveIssuedBook(reqBody).subscribe((res) => {
      console.log(res);
    });
  }
}
