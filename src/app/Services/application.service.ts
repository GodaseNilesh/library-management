import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: 'Bearer YOUR_ACCESS_TOKEN',
  });

  postData(url: string, params: any) {
    if (url.includes('/Auth')) {
      this.headers = this.headers.set('skip-interceptor', 'true');
    }
    return this.http.post(url, params, { headers: this.headers });
  }
}
