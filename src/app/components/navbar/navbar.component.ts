import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
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
    private eRef: ElementRef, // per click-outside
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
        this.checkNavbarState();

        //  se cambio pagina, chiudo sempre il menu
        this.menuAperto = false;
      });

    // 3. Listener Scroll
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onWindowScroll);
      this.checkNavbarState();
    }
  }

  /*--------- CLICK OUTSIDE + ESC ----------------------------------------*/
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.menuAperto) return;

    // Se clicco fuori dalla navbar (e quindi fuori dal menu), chiudo
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.chiudiMenu();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.menuAperto) {
      this.chiudiMenu();
    }
  }

  /*--------- GESTIONE STATO VISIVO ---------------------------------------*/
  private onWindowScroll = () => {
    this.checkNavbarState();
  };

  private checkNavbarState() {
    const isHomePage = this.currentRoute === '/' || this.currentRoute === '';
    const scrollThreshold = window.scrollY > 20;

    if (!isHomePage) {
      this.isScrolled = true;
    } else {
      this.isScrolled = scrollThreshold;
    }
  }

  private updateNavbarVisibility() {
    this.showLoginButton = !this.isLogged && (this.currentRoute === '/' || this.currentRoute === '');
    this.showHomeButton = !this.isLogged &&
      (this.currentRoute === '/login' || this.currentRoute === '/register');
    this.showProfileIcon = this.isLogged;
  }

  /*--------- AZIONI ------------------------------------------------------*/
  logout() {
    const token = this.sessionService.getToken() || '';
    this.loginService.logout(token).subscribe({
      next: () => this.handleLogoutSuccess(),
      error: () => this.handleLogoutSuccess()
    });
  }

  private handleLogoutSuccess() {
    this.sessionService.clearSession();
    this.menuAperto = false;
    this.router.navigate(['/']);
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
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
