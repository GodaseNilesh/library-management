import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { ApplicationService } from './application.service';
import { Router } from '@angular/router';
import { CommonDialogComponent } from '../components/Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  tokenExpirationCheckInterval: any;

  constructor(
    private application: ApplicationService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  userSignup(data: any) {
    let url = environment.apiUrl + '/Auth/register';
    return this.application.postData(url, data);
  }
  get userName() {
    return sessionStorage.getItem('user Name');
  }

  userLogin(data: any) {
    let url = environment.apiUrl + '/Auth/login';
    return this.application.postData(url, data);
  }
  isUserLoggedIn(): boolean {
    let userId = sessionStorage.getItem('userId');
    return userId ? true : false;
  }

  checkTokenExpiry() {
    let token = sessionStorage.getItem('token');
    let expiryTime: any = sessionStorage.getItem('expiresAt');
    if (!token || !expiryTime) {
      return true;
    }
    const expirationDate = new Date(expiryTime);
    const currentTime = new Date();
    console.log(currentTime);
    console.log(expiryTime);

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
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        setTimeout(() => {
          this.userLogout();
        }, 1000);
        if (this.tokenExpirationCheckInterval) {
          clearInterval(this.tokenExpirationCheckInterval);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tokenExpirationCheckInterval) {
      clearInterval(this.tokenExpirationCheckInterval);
    }
  }
  userLogout() {
    sessionStorage.clear();
    this.authService.isUserLoggedIn = false;
    this.router.navigate(['']);
  }
}
