import {
  Component,
  OnInit,
  DestroyRef,
  ChangeDetectorRef,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  FormsModule,
  NgForm,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LoginPageComponent } from '../module/login-page/login-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../module/header/header.component';
import { FooterComponent } from '../module/footer/footer.component';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { HttpLoaderFactory } from './translate-http-loader';
import { LanguageService } from '../shared/language.service';
import { TranslatePipe } from '../shared/translate.pipe';
import { LoadingService } from '../shared/spinner.service';
import { SpinnerComponent } from '../module/spinner/spinner.component';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
//NgForm,NgFor,NgIf,NgModel,
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    HeaderComponent,
    FooterComponent,
    TranslateModule,
    TranslatePipe,
    HttpClientModule,
    CommonModule,
    SpinnerComponent,
  ],
  providers: [LanguageService, TranslateService, LoadingService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'S-cart';
  private langSubscription: Subscription | undefined;
  isLoading$!: Observable<any>;
  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
    private router: Router,
    private authService: AuthService
  ) {
    /*   this.isLoading$ = this.loadingService.loading$.pipe(
      map(value => !!value)
    ); */
    this.isLoading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }
    });
    this.authService.autoAuthUser();
  }

  ngOnDestroy() {
    /*    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    } */
  }
}
