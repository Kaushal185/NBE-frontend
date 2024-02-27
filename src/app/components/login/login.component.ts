import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  users: any = [];
  username = '';
  password = '';
  errorMessage = ' ';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(
      data => {
        this.users = data;
        console.log(data);

      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response: HttpResponse<any>) => {
        // console.log('ANG : Login successful');
        // if user credentials are valid
        if (response.status === 200) { this.router.navigate(['dashboard/home']); }
      },
      error => {
        console.error('ANG : INVALID CRED', error);
        // if user credentials are invalid
        if (error.status === 401) { this.errorMessage = 'Invalid username or password'; }
      }
    );
  }
}
