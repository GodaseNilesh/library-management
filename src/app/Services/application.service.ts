import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  token: string | null = '';
  constructor(private http: HttpClient) {
    this.token = sessionStorage.getItem('token');
  }

  private buildHeaders(skipInterceptor: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (skipInterceptor) {
      headers = headers.set('skip-interceptor', 'true');
    }
    return headers;
  }

  postData<T, P = unknown>(url: string, params: P): Observable<T> {
    const skipInterceptor = url.includes('/Auth');
    const headers = this.buildHeaders(skipInterceptor);
    return this.http.post<T>(url, params, { headers: headers });
  }

  getData<T>(
    url: string,
    options?: {
      params?: Record<string, string | number | boolean>;
    },
  ): Observable<T> {
    const headers = this.buildHeaders();
    return this.http.get<T>(url, {
      headers,
      ...options,
    });
  }

  putData<T, P = unknown>(url: string, params: P) {
    const headers = this.buildHeaders();
    return this.http.put(url, params, { headers: headers });
  }

  deleteData(url: string) {
    const headers = this.buildHeaders();
    return this.http.delete(url, { headers: headers });
  }

  exportData(url: string): Observable<Blob> {
    const headers = this.buildHeaders();
    return this.http.get(url, {
      headers,
      responseType: 'blob',
    });
  }
}
