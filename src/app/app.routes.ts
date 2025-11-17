import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component')
        .then(m => m.RegisterComponent)
  }
  ,

  {
    path: '',
    loadComponent: () =>
    import('./pages/landing/landing.component')
      .then(m => m.LandingComponent)
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
  path: 'home',
  loadComponent: () =>
    import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  }

,

  {
  path: 'login',
  loadComponent: () =>
    import('./pages/auth/login/login.component')
      .then(m => m.LoginComponent)
  }

  ,

  {
  path: '**',
  redirectTo: '',
  pathMatch: 'full'
  }

];

