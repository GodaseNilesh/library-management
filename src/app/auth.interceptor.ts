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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private toastr:ToastrService) {}

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
    if (response.status == 200 && response.url?.includes('/Auth/login')) {
      this.toastr.info(
        `Welcome back, ${response.body.userName}!`,
        'Login Successful',
        {
          positionClass: 'toast-top-right',
          timeOut: 4000,
          closeButton: true,
        }
      );
    }
    if (this.methodType == 'PUT') {
      this.toastr.success('Data updated successfully!');
    } else if (this.methodType == 'DELETE') {
      this.toastr.success('Data deleted successfully!');
    } else if (this.methodType == 'POST' && !response.url?.includes('/Auth/login')) {
      this.toastr.success('Data added successfully!');
    }
  }

  private handleErrorResponse(error: HttpErrorResponse): void {
    this.toastr.error('Something went wrong!');
  }
}
