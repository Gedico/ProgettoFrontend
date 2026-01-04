import { bootstrapApplication } from '@angular/platform-browser';
import {provideRouter, withHashLocation} from '@angular/router';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
import { AuthInterceptor } from './app/interceptor/interceptor.interceptor';
import {registerLocaleData} from '@angular/common';

registerLocaleData(localeIt);
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor])
    ),
  ]
})
  .catch((err) => console.error(err));

