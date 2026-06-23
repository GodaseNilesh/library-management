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
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isPasswordVisible: boolean = false;
  isLoginPage: boolean = true;
  isForgotPasswordPage: boolean = false;
  isClicked: boolean = false;
  isLoading: boolean = false;
  readonly dialog = inject(MatDialog);

  otpConfig = {
    length: 6,
    inputClass: 'custom-otp-input',
    allowNumbersOnly: true,
  };

  minutes: number = 0;
  seconds: number = 10;
  timer: any;
  timeUp: boolean = false;
  otp: string = '';
  emailStatus: string = 'idle';

  loginForm!: FormGroup;
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      userName: new FormControl('', []),
    });

    this.signUpForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userRole: new FormControl('student', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.signUpForm
      .get('email')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((email) => {
          if (!email?.trim()) {
            this.emailStatus = 'idle';
          }
        }),
        filter((email) => !!email?.trim()),
        tap((x) => {
          this.emailStatus = 'checking';
        }),
        switchMap((email) => {
          return this.loginService.checkEmail(email);
        }),
      )
      .subscribe((res: any) => {
        this.emailStatus = !res.exists ? 'available' : 'exists';
      });
  }

  login() {
    this.isLoading = true;
    let reqBody = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.isClicked = true;
    this.loginService.userLogin(reqBody).subscribe(
      (next: any) => {
        this.isLoading = false;
        // this.isForgotPasswordPage = true;
        this.storeUserDetails(next);
        this.isLoginPage = false;
      },
      (error) => {
        this.isClicked = false;
        this.isLoading = false;
        console.log(error);
      },
    );
  }

  validateOTP() {
    const reqBody = {
      email: this.loginForm.value.email,
      otp: this.otp.toString(),
    };
    this.loginService.verifyOtp(reqBody).subscribe(
      (next: any) => {
        this.storeUserDetails(next);
      },
      (error) => {
        this.isClicked = false;
        this.isLoading = false;
        console.log(error);
      },
    );
  }

  storeUserDetails(userInfo:any) {
    sessionStorage.setItem('userId', userInfo.user.userId);
    sessionStorage.setItem('user Name', userInfo.user.userName);
    sessionStorage.setItem('token', userInfo.token);
    sessionStorage.setItem('expiresAt', userInfo.expiresAt);
    this.loginService.startTokenExpirationCheck();
    this.router.navigate(['/dashboard']);
    this.isClicked = true;
  }

  signUp() {
    this.isLoading = true;
    const formData = this.signUpForm.value;
    let reqBody = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailId: formData.email,
      password: formData.password,
      userRole: formData.userRole,
    };
    this.isClicked = true;
    this.loginService.userSignup(reqBody).subscribe(
      (next) => {
        this.isLoading = false;
        this.isClicked = true;
        this.signUpForm.reset();
        this.openLoginPage();
      },
      (error) => {
        this.isLoading = false;
        this.isClicked = false;
        console.log(error);
      },
    );
  }

  ngOnDestroy() {
    clearInterval(this.timer);
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
    this.isClicked = false;
  }
  openSignupPage() {
    this.isLoginPage = false;
    this.isForgotPasswordPage = false;
  }
}
