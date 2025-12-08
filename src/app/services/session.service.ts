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
      const [, payloadBase64] = token.split('.');
      if (!payloadBase64) throw new Error('Formato JWT non valido');

      const payload = JSON.parse(atob(payloadBase64));

      const exp = payload.exp;
      if (exp && Date.now() / 1000 > exp) {
        console.warn('Token scaduto, logout obbligatorio');
        return this.clearSession();
      }

      const rawRole =
        payload.ruolo ||
        payload.role ||
        payload.authority ||
        payload.authorities?.[0] ||
        payload.roles ||
        null;

      const normalized = (rawRole || '').toString().toUpperCase();

      const role =
        normalized.includes('USER')   ? 'UTENTE' :
          normalized.includes('UTENTE')   ? 'UTENTE' :
            normalized.includes('ADMIN')   ? 'ADMIN' :
              normalized.includes('AGENTE')   ? 'AGENTE' :
          null;

      if (!role) {
        console.warn('Ruolo JWT sconosciuto:', rawRole);
      }

      this.sessionState$.next({
        logged: true,
        role
      });

    } catch (err) {
      console.error('Errore parsing token:', err);
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

