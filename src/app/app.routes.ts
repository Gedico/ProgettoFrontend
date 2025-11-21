import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';


export const routes: Routes = [

/*-------------------------------LANDING---------------------------------------------------------------------------- */

// Landing Page
  { path: '',
    loadComponent: () =>import('./pages/landing/landing.component')
    .then(m => m.LandingPageComponent)
  },


/*-------------------------------AUTH---------------------------------------------------------------------------- */

  // Register
  { path: 'register',
    loadComponent: () =>import('./pages/auth/register/register.component')
    .then(m => m.RegisterComponent),
    canActivate: [LoginGuard]
  },


  // OAuth Callback
  { path: 'oauth-callback',
    loadComponent: () =>import('./pages/auth/oauth-callback/oauth-callback.component')
    .then(m => m.OAuthCallbackComponent)
  },
 
  // Login
  { path: 'login',
    loadComponent: () =>import('./pages/auth/login/login.component')
    .then(m => m.LoginComponent),
    canActivate: [LoginGuard]
  },

/*-------------------------------INSERZIONI---------------------------------------------------------------------------- */
  // InserzionE
  { path: 'inserzione/:id', 
    loadComponent: () =>import('./pages/visualizza-inserzione/visualizza-inserzione.component')
    .then(m => m.VisualizzaInserzioneComponent)
  },
  
  
/*-------------------------------REDIRECT GENERICO---------------------------------------------------------------------------- */
  {
  path: '**',
  redirectTo: '',
  pathMatch: 'full'
  }

];

