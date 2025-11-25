import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  canActivate(): boolean {
    const state = this.sessionService.getSnapshot();

    if (!state.logged) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}




