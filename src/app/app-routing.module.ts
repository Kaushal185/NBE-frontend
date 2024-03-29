import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MessageComponent } from './components/message/message.component';
import { HomeNewComponent } from './components/home-new/home-new.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthGuard } from './auth.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HistoryPageComponent } from './components/history-page/history-page.component';
const routes: Routes = [
  { path: "application", component: LandingPageComponent},
  { path: "login", component: LoginComponent },
  {
    path: "dashboard", component: NavBarComponent, children: [
      { path: "home", component: HomeComponent },
      { path: ":id/message", component: MessageComponent },
      { path: ":id/history", component: HistoryPageComponent}
    ]
    // , canActivate: [AuthGuard]git
  },
  // { path: "homeNew", component: HomeNewComponent },
  { path: "", redirectTo: "/application", pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
  //add page not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
