import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  postData(url: string, params: any) {
    const skipInterceptor = url.includes('/Auth');
    const headers = this.buildHeaders(skipInterceptor);
    return this.http.post(url, params, { headers: headers });
  }
  getData(url: string, options?: any) {
    const headers = this.buildHeaders();
    return this.http.get(url, { headers: headers, ...options });
  }
  putData(url: string, params: any) {
    const headers = this.buildHeaders();
    return this.http.put(url, params, { headers: headers });
  }
  deleteData(url: string) {
    const headers = this.buildHeaders();
    return this.http.delete(url, { headers: headers });
  }
}
