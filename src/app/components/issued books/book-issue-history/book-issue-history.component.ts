import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-issue-history',
  templateUrl: './book-issue-history.component.html',
  styleUrls: ['./book-issue-history.component.css'],
})
export class BookIssueHistoryComponent implements OnInit {
  constructor(private router: Router) {}
    // For issued book list
    issueBookRecords = [
      {
        id: 1,
        username: 'john',
        userType: 'student',
        bookId: 101,
        bookName: 'Java Basics',
        issueDate: '2025-04-10',
        dueDate: '2025-04-15',
        quantity: 2,
        status: 'pending',
        action: 'edit,delete',
      },
      {
        id: 2,
        username: 'alice',
        userType: 'teacher',
        bookId: 102,
        bookName: 'Advanced Python',
        issueDate: '2025-04-11',
        dueDate: '2025-04-18',
        quantity: 1,
        status: 'submitted',
        action: 'edit,delete',
      },
      {
        id: 3,
        username: 'mike',
        userType: 'student',
        bookId: 103,
        bookName: 'Data Structures',
        issueDate: '2025-04-09',
        dueDate: '2025-04-14',
        quantity: 3,
        status: 'pending',
        action: 'edit,delete',
      },
      {
        id: 4,
        username: 'sarah',
        userType: 'teacher',
        bookId: 104,
        bookName: 'Operating Systems',
        issueDate: '2025-04-12',
        dueDate: '2025-04-19',
        quantity: 2,
        status: 'submitted',
        action: 'edit,delete',
      },
      {
        id: 5,
        username: 'rohit',
        userType: 'student',
        bookId: 105,
        bookName: 'C++ Programming',
        issueDate: '2025-04-10',
        dueDate: '2025-04-15',
        quantity: 1,
        status: 'pending',
        action: 'edit,delete',
      },
      {
        id: 6,
        username: 'emma',
        userType: 'teacher',
        bookId: 106,
        bookName: 'Web Development',
        issueDate: '2025-04-13',
        dueDate: '2025-04-20',
        quantity: 2,
        status: 'submitted',
        action: 'edit,delete',
      },
      {
        id: 7,
        username: 'daniel',
        userType: 'student',
        bookId: 107,
        bookName: 'Machine Learning',
        issueDate: '2025-04-11',
        dueDate: '2025-04-16',
        quantity: 1,
        status: 'pending',
        action: 'edit,delete',
      },
      {
        id: 8,
        username: 'linda',
        userType: 'teacher',
        bookId: 108,
        bookName: 'Network Security',
        issueDate: '2025-04-14',
        dueDate: '2025-04-21',
        quantity: 2,
        status: 'submitted',
        action: 'edit,delete',
      },
      {
        id: 9,
        username: 'steve',
        userType: 'student',
        bookId: 109,
        bookName: 'Database Systems',
        issueDate: '2025-04-09',
        dueDate: '2025-04-13',
        quantity: 3,
        status: 'pending',
        action: 'edit,delete',
      },
      {
        id: 10,
        username: 'nina',
        userType: 'teacher',
        bookId: 110,
        bookName: 'Artificial Intelligence',
        issueDate: '2025-04-12',
        dueDate: '2025-04-17',
        quantity: 1,
        status: 'submitted',
        action: 'edit,delete',
      }
    ];
    
    
  
    issuedBookDataColumns = [
      { columnDef: 'id', header: 'ID' },
      { columnDef: 'username', header: 'User Name' },
      { columnDef: 'userType', header: 'user Type' },
      { columnDef: 'bookId', header: 'Book Id' },
      { columnDef: 'bookName', header: 'Book Name' },
      { columnDef: 'issueDate', header: 'Issue Date' },
      { columnDef: 'dueDate', header: 'Due Date' },
      { columnDef: 'quantity', header: 'Quantity' },
      { columnDef: 'status', header: 'Status' },
      { columnDef: 'action', header: 'Action' },
    ];
    
  
    issuedBooksDisplayedColumns = this.issuedBookDataColumns.map((c) => c.columnDef);
    issuedBooksDataSource = this.issueBookRecords;
    
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  quickFilter(event: Event): void {
    const element = event.target as HTMLInputElement;
    const value = element.value.trim().toLowerCase();

    if (value === '') {
      this.issuedBooksDataSource = [...this.issueBookRecords];
    } else {
      const filtered = this.issueBookRecords.filter((book) =>
        Object.values(book).some((val) =>
          val.toString().toLowerCase().includes(value)
        )
      );
      this.issuedBooksDataSource = [...filtered];
    }
  }
  onEditClicked(event: any) {
    console.log(event);
    // this.router.navigate([`book-list/add-book/${event.bookId}`]);
  }
  onDetailsClicked(event: any) {
    console.log(event);
    // this.router.navigate([`student-list/student-details/${event.studentId}`]);
  }
}
