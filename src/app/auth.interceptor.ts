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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  methodType:string='';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token=sessionStorage.getItem('token');
    let requestToSend = request;

    if (request.headers.has('skip-interceptor')) {
      const headers = request.headers.delete('skip-interceptor');
      requestToSend = request.clone({ headers });
    } else {
      requestToSend = request.clone({
        setHeaders: {
          Authorization: 'Bearer '+token,
        },
      });
    }

    this.methodType=requestToSend.method;
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
    let message='';
    if(response.status==200 && response.url?.includes('/Auth/login')){
      message=`Welcome back, ${response.body.userName}`;
    }
    if(!(this.methodType=='GET')){
      this.dialog.open(CommonDialogComponent, {
        data: {
          status: response.status,
          message: message && message || response.body.meessage || 'Data added successfully',
        },
      });
    }
  }

  private handleErrorResponse(error: HttpErrorResponse): void {
    this.dialog.open(CommonDialogComponent, {
      data: {
        status: error.status,
        // message: error.name+": An error occured" || 'Request failed',
        message: typeof (error.error)=='object' ? error.error.error : error.error
      },
    });
  }
}
