import { bootstrapApplication } from '@angular/platform-browser';
import {provideRouter, withHashLocation} from '@angular/router';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
import { AuthInterceptor } from './app/interceptor/interceptor.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor])
    ),
  ]
})
  .catch((err) => console.error(err));

