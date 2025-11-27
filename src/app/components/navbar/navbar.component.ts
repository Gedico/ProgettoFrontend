import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {CommonModule, isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../core/auth/login.service';
import { SessionService } from '../../services/session.service';
import { MenunavbarComponent } from '../menunavbar/menunavbar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenunavbarComponent, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  /*--------- VARIABILI --------------------------------------------------*/

  menuAperto: boolean = false;
  currentRoute = '';

  showLoginButton = false;
  showHomeButton = false;
  showProfileIcon = false;

  isLogged = false;
  userRole: string | null = null;

  // ⭐ Variabile per navbar trasparente/scrolled
  isScrolled = false;

  /*--------- COSTRUTTORE --------------------------------------------------*/

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private loginService: LoginService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    // 🔹 Reattivo allo stato della sessione
    this.sessionService.session$.subscribe(state => {
      this.isLogged = state.logged;
      this.userRole = state.role;
      this.updateNavbarVisibility();
    });

    // 🔹 Reattivo ai cambi di rotta
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      this.updateNavbarVisibility();

      // Navbar scura se NON siamo in home
      if (isPlatformBrowser(this.platformId)) {
        this.isScrolled = window.scrollY > 10 || this.currentRoute !== '/';
      }
    });

    // 🔹 Listener scroll — solo lato browser (fix SSR)
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 10;
      });
    }

  }


  /*--------- METODI --------------------------------------------------*/

  logout() {
    const token = this.sessionService.getToken() || '';

    this.loginService.logout(token).subscribe({
      next: () => {
        this.sessionService.clearSession();
        this.router.navigate(['/']);
      },
      error: () => {
        this.sessionService.clearSession();
        this.router.navigate(['/']);
      }
    });
  }

  toggleMenu() {
    this.menuAperto = !this.menuAperto;
  }

  chiudiMenu() {
    this.menuAperto = false;
  }


  /*--------- VISIBILITÀ ELEMENTI NAVBAR --------------------------------------------------*/

  private updateNavbarVisibility() {
    this.showLoginButton =
      !this.isLogged && this.currentRoute === '/';

    this.showHomeButton =
      !this.isLogged &&
      (this.currentRoute === '/login' || this.currentRoute === '/register');

    this.showProfileIcon = this.isLogged;
  }

}
