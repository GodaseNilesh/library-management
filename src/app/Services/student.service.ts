import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private application: ApplicationService) {}

  saveStudent(student: any) {
    let url = environment.apiUrl + '/Student';
    return this.application.postData(url, student);
  }
  getAllStudents() {
    let url = environment.apiUrl + '/Student';
    return this.application.getData(url);
  }
  getStudentById(id: string) {
    let url = environment.apiUrl + '/Student' + `/${id}`;
    return this.application.getData(url);
  }
  updateStudentById(data: any) {
    let url = environment.apiUrl + '/Student' + `/${data.studentId}`;
    return this.application.putData(url, data);
  }
  deleteStudentById(id: string) {
    let url = environment.apiUrl + '/Student' + `/${id}`;
    return this.application.deleteData(url);
  }

  exportAllStudentsData() {
    let url = environment.apiUrl + '/Student/exportStudentsData';
    return this.application.getData(url, { responseType: 'blob' as 'blob' });
  }
}
