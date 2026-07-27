import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private application: ApplicationService) {}

  getAllUsers() {
    let url = environment.apiUrl + '/users';
    return this.application.getData(url);
  }

  updateUserById(data: any) {
    let url = environment.apiUrl + `/users/${data.userId}`;
    return this.application.putData(url, data);
  }

  assignManyUsersToRole(data: any) {
    let url = environment.apiUrl + `/users/assignUsersToRole`;
    return this.application.putData(url, data);
  }

  getPendingRegistrationRequests() {
    let url = environment.apiUrl + '/users/pending-requests';
    return this.application.getData(url);
  }

  getActivities() {
    let url = environment.apiUrl + '/users/activities';
    return this.application.getData(url);
  }
}
