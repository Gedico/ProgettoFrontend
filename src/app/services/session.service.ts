import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  // Ritorna true se il token esiste (utente loggato)
  isLogged(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    return !!localStorage.getItem('token');
  }

  // Ottieni il token JWT
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    return localStorage.getItem('token');
  }

  // Logout frontend (rimuove token)
  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem('token');
  }


  getRole(): string | null {
  if (!isPlatformBrowser(this.platformId)) return null;

  const token = this.getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.ruolo || null;
  } catch (e) {
    console.error("Errore decodifica token:", e);
    return null;
  }

}

isUser(): boolean {
  return this.getRole() === 'UTENTE';
}

isAgent(): boolean {
  return this.getRole() === 'AGENTE';
}

isAdmin(): boolean {
  return this.getRole() === 'ADMIN';
}


}
