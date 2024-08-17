import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../shared/user.service';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { LanguageService } from '../shared/language.service';
import { HttpLoaderFactory } from './translate-http-loader';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { HeaderInterceptor } from '../shared/interceptors/header.interceptor';
import { ErrorInterceptor } from '../shared/interceptors/error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SpinnerService } from '../shared/spin.service';
import { HttpInterceptorService } from '../shared/http.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    UserService,
    TranslateService,
    LanguageService,
    SpinnerService,
    AuthGuard,
    importProvidersFrom(
      BrowserModule,
      HttpClient,
      FormsModule,
      HttpClientModule,
      TranslatePipe,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      NoopAnimationsModule,
      MatSnackBarModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    // { 
    //   provide: HTTP_INTERCEPTORS, 
    //   useClass: ErrorInterceptor,
    //    multi: true 
    //   },
    provideClientHydration(),
  ],
};
