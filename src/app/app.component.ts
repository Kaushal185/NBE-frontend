import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'grs-project';

  constructor (private authService: AuthService) {}

  ngOnInit() {
  // Check for the presence of the token and update the authentication state
  this.authService.isAuthenticated = !!this.authService.getAuthToken();
  }
}
