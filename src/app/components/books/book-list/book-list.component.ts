import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent {
  constructor(private router: Router) {}
  // For students list
  booksData = [
    {
      bookId: 101,
      bookName: 'Java Magics',
      language: 'English',
      author: 'John Doe',
      publisher: 'XYZ Books',
      ISBN: 123456,
      subject: 'Java',
      availableStatus: 'Available',
      availableQuantity: 5,
      totalQuantity: 7,
      action: 'edit,delete,details',
    },
    {
      bookId: 102,
      bookName: 'Python Basics',
      language: 'English',
      author: 'Jane Smith',
      publisher: 'ABC Publications',
      ISBN: 234567,
      subject: 'Python',
      availableStatus: 'Available',
      availableQuantity: 3,
      totalQuantity: 5,
      action: 'edit,delete,details',
    },
    {
      bookId: 103,
      bookName: 'Mastering C++',
      language: 'English',
      author: 'Alan Turing',
      publisher: 'TechBooks',
      ISBN: 345678,
      subject: 'C++',
      availableStatus: 'Unavailable',
      availableQuantity: 0,
      totalQuantity: 4,
      action: 'edit,delete,details',
    },
    {
      bookId: 104,
      bookName: 'Web Development 101',
      language: 'English',
      author: 'Emily Clarke',
      publisher: 'Webster House',
      ISBN: 456789,
      subject: 'Web Development',
      availableStatus: 'Available',
      availableQuantity: 6,
      totalQuantity: 6,
      action: 'edit,delete,details',
    },
    {
      bookId: 105,
      bookName: 'JavaScript Essentials',
      language: 'English',
      author: 'Chris Evans',
      publisher: 'Frontend Press',
      ISBN: 567890,
      subject: 'JavaScript',
      availableStatus: 'Available',
      availableQuantity: 2,
      totalQuantity: 3,
      action: 'edit,delete,details',
    },
    {
      bookId: 106,
      bookName: 'Data Structures',
      language: 'English',
      author: 'Grace Hopper',
      publisher: 'AlgoWorld',
      ISBN: 678901,
      subject: 'Computer Science',
      availableStatus: 'Unavailable',
      availableQuantity: 0,
      totalQuantity: 5,
      action: 'edit,delete,details',
    },
    {
      bookId: 107,
      bookName: 'Kotlin in Action',
      language: 'English',
      author: 'JetBrains Team',
      publisher: 'Mobile Devs',
      ISBN: 789012,
      subject: 'Kotlin',
      availableStatus: 'Available',
      availableQuantity: 4,
      totalQuantity: 5,
      action: 'edit,delete,details',
    },
    {
      bookId: 108,
      bookName: 'AI Fundamentals',
      language: 'English',
      author: 'Andrew Ng',
      publisher: 'ML Books',
      ISBN: 890123,
      subject: 'Artificial Intelligence',
      availableStatus: 'Available',
      availableQuantity: 1,
      totalQuantity: 2,
      action: 'edit,delete,details',
    },
    {
      bookId: 109,
      bookName: 'React for Beginners',
      language: 'English',
      author: 'Dan Abramov',
      publisher: 'ReactPress',
      ISBN: 901234,
      subject: 'React',
      availableStatus: 'Available',
      availableQuantity: 2,
      totalQuantity: 4,
      action: 'edit,delete,details',
    },
    {
      bookId: 110,
      bookName: 'Node.js in Depth',
      language: 'English',
      author: 'Ryan Dahl',
      publisher: 'Backend Works',
      ISBN: 112233,
      subject: 'Node.js',
      availableStatus: 'Available',
      availableQuantity: 3,
      totalQuantity: 6,
      action: 'edit,delete,details',
    }
  ];
  

  bookDataColumns = [
    { columnDef: 'bookId', header: 'Book ID' },
    { columnDef: 'bookName', header: 'Book Name' },
    { columnDef: 'language', header: 'Language' },
    { columnDef: 'author', header: 'Author' },
    { columnDef: 'publisher', header: 'Publisher' },
    { columnDef: 'ISBN', header: 'ISBN' },
    { columnDef: 'subject', header: 'Subject' },
    { columnDef: 'availableStatus', header: 'Status' },
    { columnDef: 'availableQuantity', header: 'Available Quantity' },
    { columnDef: 'totalQuantity', header: 'Total Quantity' },
    { columnDef: 'action', header: 'Action' },
  ];
  

  booksDisplayedColumns = this.bookDataColumns.map((c) => c.columnDef);
  booksDataSource = this.booksData;

  ngOnInit(): void {}

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.booksDataSource = [...this.booksData];
    } else {
      const filtered = this.booksData.filter((book) =>
        Object.values(book).some((val) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.booksDataSource = [...filtered];
    }
  }
  onEditClicked(event: any) {
    console.log(event);
    this.router.navigate([`book-list/add-book/${event.bookId}`]);
  }
  onDetailsClicked(event: any) {
    console.log(event);
    // this.router.navigate([`student-list/student-details/${event.studentId}`]);
  }
}
