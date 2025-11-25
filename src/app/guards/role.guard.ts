import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const RoleGuard = (allowedRoles: string[]) => {

  const router = inject(Router);
  const sessionService = inject(SessionService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return false;

  const state = sessionService.getSnapshot();

  // Utente NON loggato -> blocca
  if (!state.logged) {
    router.navigate(['/login']);
    return false;
  }

  const role = state.role;

  // Se il ruolo è tra quelli ammessi -> OK
  if (role && allowedRoles.includes(role)) {
    return true;
  }

  // Altrimenti reindirizza
  router.navigate(['/']);
  return false;
};
