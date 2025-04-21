import { Component } from '@angular/core';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent {

  StudentData = [
    {
      srNo: 1,
      issueId: 4,
      userId: 2,
      bookId: 3,
      issueDate: "2024-03-01",
      status: "Submitted",
      action:"Return Book"
    },
  ];

  StudentDataColumns = [
    { columnDef: 'srNo', header: 'Sr No.' },
    { columnDef: 'issueId', header: 'Issue Id' },
    { columnDef: 'userId', header: 'User Id' },
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'issueDate', header: 'Issue Date' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'action', header: 'Action' },
  ];

  studentsDisplayedColumns = this.StudentDataColumns.map((c) => c.columnDef);
  studentsDataSource = this.StudentData;
}
