import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';
import { Student, StudentResponse } from '../models/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private application: ApplicationService) {}

  saveStudent(student: Student) {
    let url = environment.apiUrl + '/Student';
    return this.application.postData(url, student);
  }

  getAllStudents(
    filter: Record<string, string | number | boolean> = {},
  ): Observable<StudentResponse> {
    const url = `${environment.apiUrl}/Student`;
    return this.application.getData<StudentResponse>(url, {
      params: filter,
    });
  }

  getStudentById(id: string): Observable<Student> {
    const url = `${environment.apiUrl}/Student/${id}`;
    return this.application.getData<Student>(url);
  }

  updateStudentById(data: Student) {
    let url = environment.apiUrl + '/Student' + `/${data.studentId}`;
    return this.application.putData(url, data);
  }

  deleteStudentById(id: number) {
    let url = environment.apiUrl + '/Student' + `/${id}`;
    return this.application.deleteData(url);
  }

  exportAllStudentsData(): Observable<Blob> {
    const url = `${environment.apiUrl}/Student/exportStudentsData`;
    return this.application.exportData(url);
  }
}
