import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
        this.bookService.getBookDetailsById(id).subscribe((res: any) => {
          const bookInfo = res.data[0];
          this.bookForm.patchValue({
            title: bookInfo.title,
            author: bookInfo.author,
            language: bookInfo.language,
            isbn: bookInfo.isbn,
            subject: bookInfo.subject,
            availableQuantity: bookInfo.available_quantity,
            publisher: bookInfo.publisher,
            publicationDate: new Date(bookInfo.publication_date),
            totalQuantity: bookInfo.total_quantity,
            availableStatus: bookInfo.available_status ? 'available' : 'unavailable',
          });
        });
    });
  }
  saveBook() {
    const formValue = this.bookForm.value;
    const reqBody:any = {
      title: formValue.title,
      author: formValue.author,
      language: formValue.language,
      subject: formValue.subject,
      availableQuantity: formValue.availableQuantity,
      publisher: formValue.publisher,
      publicationDate: new Date(formValue.publicationDate).toLocaleDateString('en-CA'),
      totalQuantity: formValue.totalQuantity,
      availableStatus: formValue.availableStatus === 'available' ? true : false,
    };
    if (!this.bookId) {
      reqBody.isbn = String(formValue.isbn);
      this.bookService.saveBook(reqBody).subscribe(
        (res) => {
          this.router.navigate(['/book-list']);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.bookService.updateBookById(this.bookId, reqBody).subscribe(
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
