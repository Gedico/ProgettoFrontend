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
    // ❗ IMPORTANTE: Blocca tutta la logica se siamo in SSR
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.ruolo || null;

      this.sessionState$.next({
        logged: true,
        role
      });

    } catch {
      this.sessionState$.next({
        logged: false,
        role: null
      });
    }
  }

  /** ================================
   *   SET SESSION (LOGIN)
   *  ================================ */
  setSession(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('token', token);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.ruolo || null;

      this.sessionState$.next({
        logged: true,
        role
      });

    } catch {
      console.error("Token non valido");
      this.clearSession();
    }
  }

  /** ================================
   *   CLEAR SESSION (LOGOUT)
   *  ================================ */
  clearSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem('token');

    this.sessionState$.next({
      logged: false,
      role: null
    });
  }

  /** ================================
   *   GETTERS
   *  ================================ */
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

