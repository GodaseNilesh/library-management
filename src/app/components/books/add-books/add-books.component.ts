import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/Services/book.service';

@Component({
  selector: 'app-add-books',
  templateUrl: './add-books.component.html',
  styleUrls: ['./add-books.component.css'],
})
export class AddBooksComponent {
  bookId: string = '';
  bookForm!: FormGroup;
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required]),
      isbn: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      availableQuantity: new FormControl('', [Validators.required]),
      publisher: new FormControl('', [Validators.required]),
      publicationDate: new FormControl(null, [Validators.required]),
      totalQuantity: new FormControl('', [Validators.required]),
      availableStatus: new FormControl('available', [Validators.required]),
    });
  }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      id && (this.bookId = id);
      id &&
        this.bookService.getBookDetailsById(id).subscribe((res: Book) => {
          const bookInfo = res;
          this.bookForm.patchValue({
            title: bookInfo.title,
            author: bookInfo.author,
            language: bookInfo.language,
            isbn: bookInfo.isbn,
            subject: bookInfo.subject,
            availableQuantity: bookInfo.availableQuantity,
            publisher: bookInfo.publisher,
            publicationDate: new Date(bookInfo.publicationDate),
            totalQuantity: bookInfo.totalQuantity,
            availableStatus: bookInfo.availableStatus ? 'available' : 'unavailable',
          });
        });
    });
  }
  saveBook() {
    const formValue = this.bookForm.value;
    const reqBody:Book = {
      title: formValue.title,
      author: formValue.author,
      language: formValue.language,
      subject: formValue.subject,
      availableQuantity: formValue.availableQuantity,
      publisher: formValue.publisher,
      publicationDate: new Date(formValue.publicationDate).toLocaleDateString('en-CA'),
      totalQuantity: formValue.totalQuantity,
      availableStatus: formValue.availableStatus === 'available' ? true : false,
      isbn: String(formValue.isbn)
    };
    if (!this.bookId) {
      this.bookService.saveBook(reqBody).subscribe(
        (res) => {
          this.router.navigate(['/book-list']);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.bookService.updateBookById(Number(this.bookId), reqBody).subscribe(
        (res) => {
          this.router.navigate(['/book-list']);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
