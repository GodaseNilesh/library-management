import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private application: ApplicationService) {}

  getAllUsers() {
    let url = environment.apiUrl + '/User';
    return this.application.getData(url);
  }

  updateUserById(data: any) {
    let url = environment.apiUrl + `/User/${data.userId}`;
    return this.application.putData(url, data);
  }

  assignManyUsersToRole(data: any) {
    let url = environment.apiUrl + `/User/usersToRole`;
    return this.application.putData(url, data);
  }
}
