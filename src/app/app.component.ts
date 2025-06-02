import { Component, OnInit } from '@angular/core';
import { LoginService } from './Services/login.service';
import { Router } from '@angular/router';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public loginService: LoginService,
    private router: Router,
    public authService: AuthService
  ) {}
  title = 'library';

  ngOnInit(): void {
    let token = sessionStorage.getItem('token');
    if (token) {
      this.loginService.startTokenExpirationCheck();
    }
  }

  onActionChange(event: any): void {
    const selectedValue = event.target.value;

    if (selectedValue === 'administrator') {
      // Navigate to the administrator page
      this.router.navigate(['/administrator']);
    } else if (selectedValue === 'profile') {
      // Navigate to the profile page
      this.router.navigate(['/profile']);
    } else if (selectedValue === 'logout') {
      this.logout();
    }
  }
  logout() {
    sessionStorage.clear();
    this.authService.isUserLoggedIn = false;
    this.router.navigate(['']);
  }
}
