import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonDialogComponent } from '../Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/Services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isPasswordVisible: boolean = false;
  isLoginPage: boolean = true;
  isForgotPasswordPage: boolean = false;
  readonly dialog = inject(MatDialog);

  otpConfig = {
    length: 4,
    inputClass: 'custom-otp-input',
    allowNumbersOnly: true,
  };

  minutes: number = 0;
  seconds: number = 10;
  timer: any;
  timeUp: boolean = false;
  otp: string = '';

  loginForm!: FormGroup;
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
    });

    this.signUpForm = this.fb.group({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  login() {
    console.log(this.loginForm.value);
    let reqBody = {
      userName: this.loginForm.value.userName,
      emailId: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.loginService.userLogin(reqBody).subscribe(
      (next:any) => {
        console.log(next);
        sessionStorage.setItem('userId',next.user.id);
        sessionStorage.setItem('user Name',next.user.userName);
        sessionStorage.setItem('token',next.token);
        sessionStorage.setItem('expiresAt',next.expiresAt);
        this.loginService.startTokenExpirationCheck();
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  signUp() {
    console.log(this.signUpForm.value);
    let reqBody = {
      userName: this.signUpForm.value.fullName,
      emailId: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
    };
    this.loginService.userSignup(reqBody).subscribe(
      (next) => {
        console.log(next);
        this.openLoginPage();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {});

    dialogRef.afterClosed().subscribe((result: undefined) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        // this.animal.set(result);
      }
    });
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
    this.otp = event;
    console.log('otp:', this.otp);
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
