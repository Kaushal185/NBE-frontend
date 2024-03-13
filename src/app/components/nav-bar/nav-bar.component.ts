import { Component, HostListener, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MsgDataService } from 'src/app/services/msg-data.service';
import { SwiftMsgService } from 'src/app/services/swift-msg.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  isScrolled: boolean = false;

  @Input() projectTitle: string = "";

  constructor(
    private authService: AuthService,
    private swiftService: SwiftMsgService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }


}
