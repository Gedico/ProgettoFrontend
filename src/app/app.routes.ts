import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { RoleGuard } from './guards/role.guard';
import { ProfiloComponent } from './pages/profilo/profilo.component';



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


  //Forgot Password
  {path: 'forgot-password',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password.component')
    .then(m => m.ForgotPasswordComponent)
  },


  //Reset Password
  {path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password.component')
    .then(m => m.ResetPasswordComponent)
  },




  /*-------------------------------ADMIN DASHBOARD---------------------------------------------------------------------------- */

  //adagente
  { path: 'admin/addagente',
    loadComponent: () =>import('./pages/admin/addagente/addagente.component')
    .then(m => m.AddagenteComponent),
    canActivate: [AuthGuard,() => RoleGuard(['ADMIN'])]
  },


  /*-------------------------------AGENTE DASHBOARD---------------------------------------------------------------------------- */

  {
    path: 'proposte-ricevute',
    loadComponent: () =>
      import('./pages/agente/proposte-ricevute/proposte-ricevute.component')
        .then(c => c.ProposteRicevuteComponent),
    canActivate: [AuthGuard, () => RoleGuard(['AGENTE'])]
  },

  {
    path: 'registro-proposte',
    loadComponent: () =>
      import('./pages/agente/registro-proposte/registro-proposte.component')
        .then(c => c.RegistroProposteComponent),
    canActivate: [AuthGuard, () => RoleGuard(['AGENTE'])]
  },

  {
    path: 'agente/inserzioni',
    loadComponent: () =>
      import('./pages/agente/inserzioni-agente/inserzioni-agente.component')
        .then(c => c.InserzioniAgenteComponent),
    canActivate: [AuthGuard, () => RoleGuard(['AGENTE'])]
  },


  /*-------------------------------INSERZIONI---------------------------------------------------------------------------- */
  // Inserzione
  { path: 'inserzione/:id',
    loadComponent: () =>import('./pages/inserzioni/visualizza-inserzione/visualizza-inserzione.component')
    .then(m => m.VisualizzaInserzioneComponent)
  },

  {
    path: 'inserzione/:id/proposta-manuale',
    loadComponent: () =>
      import('./pages/inserisci-proposta-manuale/inserisci-proposta-manuale.component')
        .then(m => m.InserisciPropostaManualeComponent),
    canActivate: [AuthGuard, () => RoleGuard(['AGENTE'])]
  },


  {
    path: 'profilo',
    component: ProfiloComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'proposte-inviate',
    loadComponent: () =>
      import('./pages/proposte-inviate/proposte-inviate.component')
        .then(c => c.ProposteInviateComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'ricerca',
    loadComponent: () => import('./pages/risultati-ricerca/risultati-ricerca.component')
      .then(m => m.RisultatiRicercaComponent)
  },


  {
    path: 'agente/inserzioni/nuova',
    loadComponent: () => import('./components/crea-inserzione/crea-inserzione.component')
      .then(m => m.CreaInserzioneComponent)
  },



  /*-------------------------------REDIRECT GENERICO---------------------------------------------------------------------------- */
  {
  path: '**',
  redirectTo: '',
  pathMatch: 'full'
  },



];

