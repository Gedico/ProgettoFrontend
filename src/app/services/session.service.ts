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

    this.applyToken(token);
  }

  /** ======================================
   *   APPLICA IL TOKEN (LOGIN)
   *  ====================================== */
  setSession(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('token', token);
    this.applyToken(token);
  }

  /** ======================================
   *   PARSE SICURO DEL TOKEN
   *  ====================================== */
  private applyToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // 🔥 SUPPORTA TUTTE LE POSSIBILI KEY DI SPRING
      const role =
        payload.ruolo ||
        payload.role ||
        payload.authority ||
        payload.authorities?.[0] ||
        payload['roles'] ||
        null;

      this.sessionState$.next({
        logged: true,
        role
      });

    } catch (e) {
      console.error("ERRORE PARSING TOKEN:", e);
      this.clearSession();
    }
  }

  /** ======================================
   *   LOGOUT
   *  ====================================== */
  clearSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem('token');

    this.sessionState$.next({
      logged: false,
      role: null
    });
  }

  /** ======================================
   *   GETTERS
   *  ====================================== */
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

