import {Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ElementRef, HostListener} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

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
  private readonly isBrowser: boolean;

  /*--------- COSTRUTTORE --------------------------------------------------*/
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private loginService: LoginService,
    private eRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // 1) Session state
    this.sessionService.session$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isLogged = state.logged;
        this.userRole = state.role;
        this.updateNavbarVisibility();
      });

    // 2) Route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentRoute = this.router.url;
        this.updateNavbarVisibility();

        // ✅ checkNavbarState usa window => solo in browser
        if (this.isBrowser) {
          this.checkNavbarState();
        } else {
          // in SSR: se non sei in home, vogliamo navbar "scrolled"
          const isHomePage = this.currentRoute === '/' || this.currentRoute === '';
          this.isScrolled = !isHomePage;
        }

        // se cambio pagina, chiudo sempre il menu
        this.menuAperto = false;
      });

    // 3) Scroll listener (solo browser)
    if (this.isBrowser) {
      window.addEventListener('scroll', this.onWindowScroll, { passive: true });
      this.checkNavbarState();
    }
  }

  /*--------- CLICK OUTSIDE + ESC ----------------------------------------*/
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.menuAperto) return;

    // SSR-safe: HostListener su document può scattare anche in ambienti strani,
    // ma qui usiamo solo eRef (che esiste nel browser). In SSR normalmente non arriva.
    if (this.isBrowser && !this.eRef.nativeElement.contains(event.target)) {
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

  private checkNavbarState(): void {
    // ✅ Protezione totale
    if (!this.isBrowser) return;

    const isHomePage = this.currentRoute === '/' || this.currentRoute === '';
    const scrollThreshold = window.scrollY > 20;

    this.isScrolled = !isHomePage ? true : scrollThreshold;
  }

  private updateNavbarVisibility(): void {
    this.showLoginButton = !this.isLogged && (this.currentRoute === '/' || this.currentRoute === '');
    this.showHomeButton = !this.isLogged &&
      (this.currentRoute === '/login' || this.currentRoute === '/register');
    this.showProfileIcon = this.isLogged;
  }

  /*--------- AZIONI ------------------------------------------------------*/
  logout(): void {
    const token = this.sessionService.getToken() || '';
    this.loginService.logout(token).subscribe({
      next: () => this.handleLogoutSuccess(),
      error: () => this.handleLogoutSuccess()
    });
  }

  private handleLogoutSuccess(): void {
    this.sessionService.clearSession();
    this.menuAperto = false;
    this.router.navigate(['/']);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuAperto = !this.menuAperto;
  }

  chiudiMenu(): void {
    this.menuAperto = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onWindowScroll);
    }
  }
}
