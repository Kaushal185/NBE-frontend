import { Component, HostListener, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  isScrolled: boolean = false;

  @Input() projectTitle: string = "";

  constructor(
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }


}
