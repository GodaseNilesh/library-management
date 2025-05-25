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

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    debugger
    let requestToSend = request;

    if (request.headers.has('skip-interceptor')) {
      const headers = request.headers.delete('skip-interceptor');
      requestToSend = request.clone({ headers });
    } else {
      requestToSend = request.clone({
        setHeaders: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        },
      });
    }

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
    debugger
    this.dialog.open(CommonDialogComponent, {
      data: {
        status: response.status,
        message: response.statusText || 'Request succeeded',
      },
    });
  }

  private handleErrorResponse(error: HttpErrorResponse): void {
    debugger
    this.dialog.open(CommonDialogComponent, {
      data: {
        status: error.status,
        message: error.name+": An error occured" || 'Request failed',
      },
    });
  }
}
