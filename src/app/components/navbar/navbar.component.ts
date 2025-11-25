import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../core/auth/login.service';
import { SessionService } from '../../services/session.service';
import { MenunavbarComponent} from '../menunavbar/menunavbar.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenunavbarComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

/*---------VARIABILI---------------------------------------------------------------------------------------------------------*/

  menuAperto: boolean = false;
  currentRoute = '';

  showLoginButton = false;
  showHomeButton = false;
  showProfileIcon = false;

  isLogged = false;
  userRole: string | null = null;



/*------COSTRUTTORE---------------------------------------------------------------------------------------------------------------*/

  constructor(private router: Router, private sessionService: SessionService , private loginService: LoginService) {
    // reattivo alla sessione
    this.sessionService.session$.subscribe(state => {
      this.isLogged = state.logged;
      this.userRole = state.role;
      this.updateNavbarVisibility();
    });

    // reattivo alla rotta
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      this.updateNavbarVisibility();
    });
  }


  /**----------METODI--------------------------------------------------------------------------------------------------------*/

  logout() {
    const token = this.sessionService.getToken() || '';

    this.loginService.logout(token).subscribe({
      next: () => {
        this.sessionService.clearSession();
        this.router.navigate(['/']);
      },
      error: () => {
        // In caso di errore backend, comunque fai logout locale
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


  /*----------AGGIORNA NAVBAR--------------------------------------------------------------------------------------------------------*/

  private updateNavbarVisibility() {
    this.showLoginButton = !this.isLogged && this.currentRoute === '/';
    this.showHomeButton  = !this.isLogged && (this.currentRoute === '/login' || this.currentRoute === '/register');
    this.showProfileIcon = this.isLogged;
  }


}
