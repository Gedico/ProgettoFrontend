import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { SessionService } from '../../services/session.service';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private loginService: LoginService,
    private session: SessionService
  ) {}


/*******LOGIN CLASSICO**************************************************************************************************/

login(credentials: { mail: string; password: string }) {
  return this.loginService.login(credentials).pipe(
    tap(res => {
      const token = res?.token;
      if (!token) {
        throw new Error("Token mancante nella risposta del login");
      }
      this.session.setSession(token);
    }),
    catchError(err => {
      return throwError(() => err);
    })
  );
}

/** LOGIN OAUTH *******************************************************************************************************/

  loginWithProvider(provider: 'google' | 'facebook' | 'github') {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  }

/** CALLBACK OAUTH ****************************************************************************************************/

handleOAuthCallback(token: string) {
  if (!token || token.trim().length < 20) {
    console.error("Token OAuth non valido", token);
    return;
  }
  this.session.setSession(token);
}


}
