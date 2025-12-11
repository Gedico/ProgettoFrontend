import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SessionState {
  logged: boolean;
  role: string | null;
}

interface JwtPayload {
  exp?: number;
  ruolo?: string;
  role?: string;
  authority?: string;
  authorities?: string[];
  roles?: string[] | string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly sessionState$ = new BehaviorSubject<SessionState>({
    logged: false,
    role: null
  });

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    if (!this.canUseBrowser()) return;

    const token = localStorage.getItem('token');
    if (token) {
      this.applyToken(token);
    }
  }

  /** ======================================
   *   OBSERVABLE PUBBLICO
   *  ====================================== */
  get session$(): Observable<SessionState> {
    return this.sessionState$.asObservable();
  }

  /** ======================================
   *   LOGIN / SALVATAGGIO TOKEN
   *  ====================================== */
  setSession(token: string): void {
    if (!this.canUseBrowser()) return;

    localStorage.setItem('token', token);
    this.applyToken(token);
  }

  /** ======================================
   *   PARSE JWT
   *  ====================================== */
  private applyToken(token: string): void {
    const payload = this.decodeJwt(token);

    if (!payload) {
      return this.clearSession();
    }

    if (this.isExpired(payload)) {
      return this.clearSession();
    }

    const role = this.mapRole(payload);

    this.sessionState$.next({
      logged: true,
      role
    });
  }

  private decodeJwt(token: string): JwtPayload | null {
    try {
      const [, payloadBase64] = token.split('.');
      if (!payloadBase64) return null;

      return JSON.parse(atob(payloadBase64)) as JwtPayload;

    } catch {
      return null;
    }
  }

  private isExpired(payload: JwtPayload): boolean {
    return payload.exp ? Date.now() / 1000 > payload.exp : false;
  }

  private mapRole(payload: JwtPayload): string | null {
    const raw =
      payload.ruolo ??
      payload.role ??
      payload.authority ??
      payload.authorities?.[0] ??
      payload.roles ??
      null;

    if (!raw) return null;

    const normalized = raw.toString().toUpperCase();

    if (normalized.includes('ADMIN')) return 'ADMIN';
    if (normalized.includes('AGENTE')) return 'AGENTE';
    return 'UTENTE'; // default
  }

  /** ======================================
   *   LOGOUT
   *  ====================================== */
  clearSession(): void {
    if (this.canUseBrowser()) {
      localStorage.removeItem('token');
    }

    this.sessionState$.next({
      logged: false,
      role: null
    });
  }

  /** ======================================
   *   GETTERS
   *  ====================================== */
  getSnapshot(): SessionState {
    return this.sessionState$.getValue();
  }

  getToken(): string | null {
    return this.canUseBrowser() ? localStorage.getItem('token') : null;
  }

  getRole(): string | null {
    return this.sessionState$.getValue().role;
  }

  /** ======================================
   *   UTILITY
   *  ====================================== */
  private canUseBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
