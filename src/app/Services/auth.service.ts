import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  isUserLoggedIn: boolean = false;
  isAuthenticated(): boolean {
    let token = sessionStorage.getItem('token');
    this.isUserLoggedIn = token ? true : false;
    return this.isUserLoggedIn;
  }
}
