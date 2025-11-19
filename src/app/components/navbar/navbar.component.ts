import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) { }



  // Controllo login
  get isLogged(): boolean {
    return this.sessionService.isLogged();
  }

  // Rotta attuale
  get currentRoute(): string {
    return this.router.url;
  }


  get showLoginButton(): boolean {
    return !this.isLogged && (this.currentRoute === '/' );
  }

  get showHomeButton(): boolean {
    return !this.isLogged && (this.currentRoute === '/login' || this.currentRoute === '/register');
  }
  

  get showProfileIcon(): boolean {
    return this.isLogged;
  }

  get loginLink(): string {
    return '/login';
  }

  get homeLink(): string {
    return '/';
  }

  
  // Logout (verrà usato nella fase 2)
  logout() {
    this.sessionService.logout();
    this.router.navigate(['/']);
  }

//Metodi per verifica ruolo 
get isUser(): boolean { return this.sessionService.isUser(); }

get isAgent(): boolean { return this.sessionService.isAgent(); }

get isAdmin(): boolean { return this.sessionService.isAdmin(); }

get userRole(): string | null {
  return this.sessionService.getRole();
}





}
