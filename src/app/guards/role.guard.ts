import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const RoleGuard = (allowedRoles: string[]) => {

  const router = inject(Router);
  const sessionService = inject(SessionService);
  const platformId = inject(PLATFORM_ID);

  // SSR check
  if (!isPlatformBrowser(platformId)) return false;

  // Se non loggato → blocca subito
  if (!sessionService.isLogged()) {
    router.navigate(['/']);
    return false;
  }

  const role = sessionService.getRole();

  // Consenti solo se il ruolo è tra quelli ammessi
  if (role && allowedRoles.includes(role)) {
    return true;
  }

  // Altrimenti rifiuta e reindirizza (per ora alla home)
  router.navigate(['/']);
  return false;
};
