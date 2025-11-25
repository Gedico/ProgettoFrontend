import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface SessionState {
  logged: boolean;
  role: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sessionState$ = new BehaviorSubject<SessionState>({
    logged: false,
    role: null
  });

  get session$() {
    return this.sessionState$.asObservable();
  }

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    // decode JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.ruolo || null;

      this.sessionState$.next({
        logged: true,
        role
      });
    } catch {
      // token corrotto → reset stato
      this.sessionState$.next({
        logged: false,
        role: null
      });
    }
  }

  // chiamato dopo login
  setSession(token: string): void {
    localStorage.setItem('token', token);

    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.ruolo || null;

    this.sessionState$.next({
      logged: true,
      role
    });
  }

  // logout frontend (solo stato + localStorage)
  clearSession(): void {
    localStorage.removeItem('token');

    this.sessionState$.next({
      logged: false,
      role: null
    });
  }

  getSnapshot() {
    return this.sessionState$.getValue();
  }


  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('token');
  }


  getRole(): string | null {
    return this.sessionState$.getValue().role;
  }

}

