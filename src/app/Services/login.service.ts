import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';
import { Router } from '@angular/router';
import { CommonDialogComponent } from '../components/Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { LoginResponse, signUpRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  tokenExpirationCheckInterval!: ReturnType<typeof setInterval>;

  constructor(
    private application: ApplicationService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  userSignup(data: signUpRequest) {
    let url = environment.apiUrl + '/Auth/register';
    return this.application.postData(url, data);
  }
  get userName() {
    return sessionStorage.getItem('user Name');
  }

  userLogin(data: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    let url = environment.apiUrl + '/Auth/login';
    return this.application.postData<LoginResponse>(url, data);
  }

  checkEmail(email: string) {
    const url = environment.apiUrl + '/Auth/check-email';
    return this.application.getData<{ exists: boolean }>(url, {
      params: { email },
    });
  }

  verifyOtp(data: { email: string; otp: string }) {
    let url = environment.apiUrl + '/Auth/verify-otp';
    return this.application.postData<LoginResponse>(url, data);
  }

  isUserLoggedIn(): boolean {
    let userId = sessionStorage.getItem('userId');
    return userId ? true : false;
  }

  checkTokenExpiry() {
    let token = sessionStorage.getItem('token');
    let expiryTime = sessionStorage.getItem('expiresAt');
    if (!token || !expiryTime) {
      return true;
    }
    const expirationDate = new Date(Number(expiryTime));
    const currentTime = new Date();
    return currentTime > expirationDate;
  }
  startTokenExpirationCheck() {
    this.tokenExpirationCheckInterval = setInterval(() => {
      if (this.checkTokenExpiry()) {
        this.handleSessionExpired();
      }
    }, 60000);
  }

  handleSessionExpired() {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      disableClose: true,
      data: {
        status: 'Session Timeout',
        message: 'Session has expired. Please log in again.',
        action: {
          cancel: true,
          confirm: true,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        setTimeout(() => {
          if (this.tokenExpirationCheckInterval) {
            clearInterval(this.tokenExpirationCheckInterval);
          }
          this.userLogout();
        }, 1000);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tokenExpirationCheckInterval) {
      clearInterval(this.tokenExpirationCheckInterval);
    }
  }

  userLogout() {
    // const userId = sessionStorage.getItem('userId');
    // const payload = { id: userId };
    // let url = environment.apiUrl + '/Auth/logout';
    // this.application.postData(url, payload).subscribe((res) => {
    //   clearInterval(this.tokenExpirationCheckInterval);
    //   sessionStorage.clear();
    //   this.authService.isUserLoggedIn = false;
    //   this.router.navigate(['']);
    // });

    sessionStorage.clear();
    this.router.navigate(['']);
    this.authService.isAuthenticated();
  }
}
