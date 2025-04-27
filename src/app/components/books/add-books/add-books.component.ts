import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-books',
  templateUrl: './add-books.component.html',
  styleUrls: ['./add-books.component.css'],
})
export class AddBooksComponent {
  bookId: string = '';
  bookForm!:FormGroup;

  constructor(private route: ActivatedRoute, private fb:FormBuilder) {
    this.bookForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required]),
      isbn: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      availableQuantity: new FormControl('', [Validators.required]),
      publisher: new FormControl('', [Validators.required]),
      publicationDate: new FormControl('', [Validators.required]),
      totalQuantity: new FormControl('', [Validators.required]),
      availableStatus: new FormControl('available', [Validators.required]),
    });
  }

  
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      id && (this.bookId = id);
    });
  }
  saveBook(){
    console.log(this.bookForm.value);
    
  }
}
