import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

// Import dei tuoi servizi e componenti
import { SessionService } from '../../services/session.service';
import { LoginService } from '../../core/auth/login.service';
import { MenunavbarComponent } from '../menunavbar/menunavbar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenunavbarComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  /*--------- PROPRIETÀ --------------------------------------------------*/
  menuAperto = false;
  currentRoute = '';
  isScrolled = false;

  // Visibilità elementi
  showLoginButton = false;
  showHomeButton = false;
  showProfileIcon = false;

  // Stato Utente
  isLogged = false;
  userRole: string | null = null;

  private destroy$ = new Subject<void>();

  /*--------- COSTRUTTORE --------------------------------------------------*/
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private loginService: LoginService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // 1. Reattivo allo stato della sessione
    this.sessionService.session$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isLogged = state.logged;
        this.userRole = state.role;
        this.updateNavbarVisibility();
      });

    // 2. Reattivo ai cambi di rotta (NavigationEnd)
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentRoute = this.router.url;
        this.updateNavbarVisibility();
        this.checkNavbarState(); // Forza il controllo del colore al cambio pagina
      });

    // 3. Listener Scroll
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onWindowScroll);
      // Controllo iniziale al caricamento
      this.checkNavbarState();
    }
  }

  /*--------- GESTIONE STATO VISIVO ---------------------------------------*/

  // Funzione chiamata dallo scroll
  private onWindowScroll = () => {
    this.checkNavbarState();
  };

  /**
   * Logica intelligente: la navbar è "scura" (scrolled) se:
   * - non siamo nella pagina Home (/)
   * -il colore andrebbe a contrastarlo
   */
  private checkNavbarState() {
    const isHomePage = this.currentRoute === '/' || this.currentRoute === '';
    const scrollThreshold = window.scrollY > 20;

    if (!isHomePage) {
      this.isScrolled = true; // Sempre scura nelle altre pagine
    } else {
      this.isScrolled = scrollThreshold; // In home dipende dallo scroll
    }
  }

  private updateNavbarVisibility() {
    // Mostra login solo se non loggato e siamo in home
    this.showLoginButton = !this.isLogged && (this.currentRoute === '/' || this.currentRoute === '');

    // Mostra tasto home nelle pagine di auth
    this.showHomeButton = !this.isLogged &&
      (this.currentRoute === '/login' || this.currentRoute === '/register');

    // Mostra profilo solo se loggato
    this.showProfileIcon = this.isLogged;
  }

  /*--------- AZIONI ------------------------------------------------------*/
  logout() {
    const token = this.sessionService.getToken() || '';
    this.loginService.logout(token).subscribe({
      next: () => this.handleLogoutSuccess(),
      error: () => this.handleLogoutSuccess() // Forza pulizia anche in errore
    });
  }

  private handleLogoutSuccess() {
    this.sessionService.clearSession();
    this.menuAperto = false;
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.menuAperto = !this.menuAperto;
  }

  chiudiMenu() {
    this.menuAperto = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onWindowScroll);
    }
  }
}
