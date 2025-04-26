import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-details',
  templateUrl: './teacher-details.component.html',
  styleUrls: ['./teacher-details.component.css']
})
export class TeacherDetailsComponent {

  TeacherData = [
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

  teacherDataColumns = [
    { columnDef: 'srNo', header: 'Sr No.' },
    { columnDef: 'issueId', header: 'Issue Id' },
    { columnDef: 'userId', header: 'User Id' },
    { columnDef: 'bookId', header: 'Book Id' },
    { columnDef: 'issueDate', header: 'Issue Date' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'action', header: 'Action' },
  ];

  teacherDisplayedColumns = this.teacherDataColumns.map((c) => c.columnDef);
  teacherDataSource = this.TeacherData;
}
