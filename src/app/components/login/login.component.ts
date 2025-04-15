import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isPasswordVisible: boolean = false;
  isLoginPage: boolean = true;
  isForgotPasswordPage: boolean = false;

  otpConfig = {
    length: 4,
    inputClass: 'custom-otp-input',
    allowNumbersOnly: true,
  };

  minutes: number = 0;
  seconds: number = 10;
  timer: any;
  timeUp: boolean = false;
  otp:string='';

  ngOnInit(): void {
  }

  ngOnDestroy() {
    clearInterval(this.timer); // clean up
  }

  startTimer() {
    clearInterval(this.timer);
    this.timeUp = false;
    this.minutes = 1;
    this.seconds = 30;

    this.timer = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        if (this.minutes > 0) {
          this.minutes--;
          this.seconds = 59;
        } else {
          this.timeUp = true;
          clearInterval(this.timer);
        }
      }
    }, 1000);
  }

  resendOtp() {
    this.startTimer();
  }

  onOtpChange(event: any) {
    this.otp=event;
    console.log('otp:',this.otp);
    
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  openOtpPage() {
    this.isForgotPasswordPage = true;
    this.startTimer();
    this.isLoginPage = !this.isLoginPage;
  }
  openLoginPage() {
    this.isLoginPage = true;
    this.isForgotPasswordPage = false;
  }
  openSignupPage() {
    this.isLoginPage = false;
    this.isForgotPasswordPage = false;
  }
}
