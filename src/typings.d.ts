import { RazorpayOptions, RazorpayInstance } from './app/models/payment.model';

declare global {
  var Razorpay: new (
    options: RazorpayOptions
  ) => RazorpayInstance;
}

export {};
