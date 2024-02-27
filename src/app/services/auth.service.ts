import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  private authTokenKey = 'authToken';


  private apiUrl = 'http://localhost:8090/api/user'; // Update with your Spring Boot backend URL

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticatedStatus(): boolean {
    return this.isAuthenticated;
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  getAllUsers(): Observable<any[]> {
    const url = `${this.apiUrl}/get`;
    return this.http.get<any[]>(url);
  }

   login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, { "userId":username, "password":password },{observe: "response", responseType:'text'})
    .pipe(
      tap((response: HttpResponse<string>) => {
        if (response.status >= 200 && response.status < 300) {
          // Set isAuthenticated to true on a successful login
          this.isAuthenticated = true;}
          // Store the token in localStorage
          localStorage.setItem(this.authTokenKey, response.body || '');
        })); // adjust response according to backend
  }

  logout(): void {
    // Clear the token and update the authentication state
    localStorage.removeItem(this.authTokenKey);
    this.router.navigate(['application']);
    this.isAuthenticated = false;
  }
}
