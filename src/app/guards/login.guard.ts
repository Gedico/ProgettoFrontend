import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { SessionService } from '../services/session.service';

export const LoginGuard = () => {

  const router = inject(Router);
  const sessionService = inject(SessionService);
  const platformId = inject(PLATFORM_ID);

  // SSR check
  if (!isPlatformBrowser(platformId)) return false;

  // Se loggato → blocca accesso a login/register e manda a home
  if (sessionService.isLogged()) {
    router.navigate(['/home']);
    return false;
  }

  // Se NON loggato → può accedere
  return true;
};
