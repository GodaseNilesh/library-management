import { Component } from '@angular/core';
import { LoginService } from './Services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public loginService: LoginService, private router: Router) {}
  title = 'library';

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
    this.router.navigate(['']);
  }
}
