import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private applicationService: ApplicationService) {}

  createOrder(issueId: number) {
    let url = environment.apiUrl + '/payments/create-order';
    return this.applicationService.postData(url, { issueId: issueId });
  }

  verifyPayment(paymentData: any) {
    let url = environment.apiUrl + '/payments/verify';
    return this.applicationService.postData(url, paymentData);
  }
}
