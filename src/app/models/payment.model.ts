export interface verifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  issued_id: number;
}

export interface verifyPaymentResponse {
  data: {
    message: string;
    success: boolean
  }
}

export interface CreateOrderData {
  message: string;
  key: string;
  orderId: string;
  amount: number;
  currency: string;
  issueId: number;
  fineAmount: number;
}

export interface CreateOrderResponse {
  data: CreateOrderData;
}

export interface PaymentSuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open(): void;
  close(): void;
}
