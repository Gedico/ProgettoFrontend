import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { VisualizzaInserzioneComponent } from './pages/visualizza-inserzione/visualizza-inserzione.component';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component')
        .then(m => m.RegisterComponent),
    canActivate: [LoginGuard]
  }
  ,

  {
    path: '',
    loadComponent: () =>
    import('./pages/landing/landing.component')
      .then(m => m.LandingPageComponent)
  }
  ,

  {
  path: 'oauth-callback',
  loadComponent: () =>
    import('./pages/auth/oauth-callback/oauth-callback.component')
      .then(m => m.OAuthCallbackComponent)
  }
 ,

  {
  path: 'login',
  loadComponent: () =>
    import('./pages/auth/login/login.component')
      .then(m => m.LoginComponent),
  canActivate: [LoginGuard]
  }

  ,
  
  {

    path: 'inserzione/:id', component: VisualizzaInserzioneComponent

  }
  
  ,

  {
  path: '**',
  redirectTo: '',
  pathMatch: 'full'
  }

];

