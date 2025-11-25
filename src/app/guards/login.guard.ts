import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { SessionService } from '../services/session.service';

export const LoginGuard = () => {

  const router = inject(Router);
  const sessionService = inject(SessionService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return false;

  const state = sessionService.getSnapshot();

  if (state.logged) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};

