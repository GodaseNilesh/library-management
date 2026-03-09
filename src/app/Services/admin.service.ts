import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private application: ApplicationService) {}

  updatePendingRequestStatus(userId: string, payload: object) {
    let url = environment.apiUrl + `/User/updateStatus/${userId}`;
    return this.application.putData(url, payload);
  }
}
