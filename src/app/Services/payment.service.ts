import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';
import { CreateOrderResponse, verifyPaymentRequest, verifyPaymentResponse } from '../models/payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private applicationService: ApplicationService) {}

  createOrder(issueId: number):Observable<CreateOrderResponse> {
    let url = environment.apiUrl + '/payments/create-order';
    return this.applicationService.postData<CreateOrderResponse>(url, { issueId: issueId });
  }

  verifyPayment(paymentData: verifyPaymentRequest):Observable<verifyPaymentResponse> {
    let url = environment.apiUrl + '/payments/verify';
    return this.applicationService.postData<verifyPaymentResponse>(url, paymentData);
  }
}
