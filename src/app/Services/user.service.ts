import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';
import { AssignRoleToUsers, PendingRequest, RecentActivity, UpdateUser, User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private application: ApplicationService) {}

  getAllUsers(): Observable<User[]> {
    let url = environment.apiUrl + '/users';
    return this.application.getData<User[]>(url);
  }

  updateUserById(data: UpdateUser) {
    let url = environment.apiUrl + `/users/${data.userId}`;
    return this.application.putData(url, data);
  }

  assignManyUsersToRole(data: AssignRoleToUsers) {
    let url = environment.apiUrl + `/users/assignUsersToRole`;
    return this.application.putData(url, data);
  }

  getPendingRegistrationRequests(): Observable<PendingRequest[]> {
    let url = environment.apiUrl + '/users/pending-requests';
    return this.application.getData<PendingRequest[]>(url);
  }

  getActivities():Observable<RecentActivity[]> {
    let url = environment.apiUrl + '/users/activities';
    return this.application.getData<RecentActivity[]>(url);
  }
}
