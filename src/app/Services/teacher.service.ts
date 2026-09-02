import { Injectable } from '@angular/core';
import { ApplicationService } from './application.service';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { Teacher, TeacherResponse } from '../models/teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(private application: ApplicationService) {}

  saveTeacher(teacher: Teacher) {
    let url = environment.apiUrl + '/Teacher';
    return this.application.postData(url, teacher);
  }

  getAllTeachers(filter: { email?: string } = {}): Observable<TeacherResponse> {
    let url = environment.apiUrl + '/Teacher';
    return this.application.getData<TeacherResponse>(url, { params: filter });
  }

  getTeacherById(id: string): Observable<Teacher> {
    let url = environment.apiUrl + `/Teacher/${id}`;
    return this.application.getData<Teacher>(url);
  }

  updateTeacherById(teacher: Teacher) {
    let url = environment.apiUrl + `/Teacher/${teacher.teacherId}`;
    return this.application.putData(url, teacher);
  }

  deleteTeacherById(id: number) {
    let url = environment.apiUrl + `/Teacher/${id}`;
    return this.application.deleteData(url);
  }

  exportAllTeachersData() {
    let url = environment.apiUrl + '/Teacher/exportTeachersData';
    return this.application.exportData(url);
  }
}
