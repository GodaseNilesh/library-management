import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private application: ApplicationService) {}

  saveTeacher(teacher: any) {
    let url = environment.apiUrl + '/Teacher';
    return this.application.postData(url, teacher);
  }

  getAllTeachers() {
    let url = environment.apiUrl + '/Teacher';
    return this.application.getData(url);
  }
  getTeacherById(id: string) {
    let url = environment.apiUrl + `/Teacher/${id}`;
    return this.application.getData(url);
  }
  updateTeacherById(teacher: any) {
    let url = environment.apiUrl + `/Teacher/${teacher.teacherId}`;
    return this.application.putData(url, teacher);
  }
  deleteTeacherById(id: string) {
    let url = environment.apiUrl + `/Teacher/${id}`;
    return this.application.deleteData(url);
  }

  exportAllTeachersData() {
    let url = environment.apiUrl + '/Teacher/exportTeachersData';
    return this.application.getData(url, { responseType: 'blob' as 'blob' });
  }
}
