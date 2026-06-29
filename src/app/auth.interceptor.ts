import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CommonDialogComponent } from './components/Shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from './Services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private toastr:ToastrService, private loginService: LoginService) {}

  methodType: string = '';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = sessionStorage.getItem('token');
    let requestToSend = request;

    if (request.headers.has('skip-interceptor')) {
      const headers = request.headers.delete('skip-interceptor');
      requestToSend = request.clone({ headers });
    } else {
      requestToSend = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }

    this.methodType = requestToSend.method;
    return next.handle(requestToSend).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.handleSuccessResponse(event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleErrorResponse(error);
        return throwError(() => error);
      })
    );
  }

  private handleSuccessResponse(response: HttpResponse<any>): void {
    let message = '';
    if (response.status == 200 && (response.url?.includes('/Auth/verify-otp') || response.url?.includes('/Auth/login'))) {
      this.toastr.info(
        `Welcome back, ${response.body.user.userName}!`,
        'Login Successful',
        {
          positionClass: 'toast-top-right',
          timeOut: 4000,
          closeButton: true,
        }
      );
    }
    const endPoints = ['check-email', 'login'];
    if (this.methodType == 'PUT') {
      this.toastr.success(response.body.data.message ?? 'Data updated successfully!');
    } else if (this.methodType == 'DELETE') {
      this.toastr.success(response.body.data.message ?? 'Data deleted successfully!');
    } else if (this.methodType == 'POST' && !endPoints.some(ep => response.url?.includes(ep))) {
      this.toastr.success(response.body.data.message ?? 'Data added successfully!');
    }
  }

  private handleErrorResponse(error: HttpErrorResponse): void {
    error.error && typeof error.error === 'object'
      ? error.error instanceof Blob
        ? this.toastr.error('Something went wrong!')
        : this.toastr.error(error.error.message)
      : this.toastr.error('Something went wrong!');

    if (error.error?.error?.includes('expired token') || error.status === 401) {
      this.loginService.handleSessionExpired();
    }
  }
}
