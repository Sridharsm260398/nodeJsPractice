import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { LanguageService } from '../../shared/language.service';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ChatComponent } from '../chat/chat.component';
import { UserService } from '../../shared/user.service';
import { ProfileService } from '../../shared/profile.service';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatDatepickerModule,
    TranslateModule,
    NgIf,
    NgFor,
    RouterModule,
    RouterLink,
    HighlightDirective
  ],
  providers: [LanguageService, TranslateService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  // schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private langChangeSubscription!: Subscription;
  private routerSubscription!: Subscription;
  private authListnerSub! :Subscription
  isUserAuthenticated:boolean=false
  //langs: any = { 'de': 'German', 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'pt': 'Portuguese', 'ru': 'Russian' };
  currentLang: string = 'en';
  //currentLang!: string;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private authService:AuthService,
    private userService:UserService,
    private profilePhoto:ProfileService
  ) { }
  openChat(): void {
    this.dialog.open(ChatComponent, {
      data: {
        userId: 'currentUserId',
        receiverId: 'receiverUserId', 
        userIconUrl: 'currentUserIconUrl',
        receiverIconUrl: 'receiverUserIconUrl' 
      }
    });
  }
  ngOnInit() {
    this.langChangeSubscription = this.languageService.getCurrentLanguage().subscribe(lang => {
      this.currentLang = lang;
      this.translateService.use(lang); 
      this.cdr.detectChanges();
      //console.log(`AccountComponent: ${lang}`);
    });

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.cdr.detectChanges();
      }
    });
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authListnerSub =this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.isUserAuthenticated =isAuthenticated
    })
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authListnerSub) {
      this.authListnerSub.unsubscribe();
    }
  }

  setLanguage(language: string) {
    this.languageService.setLanguage(language);
    console.log(`Language set to ${language}`);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  onLogout() {
    this.authService.logout();
    console.log('Logging out...');
  }
  toggleSidebar() {
    var sidebar = document.querySelector('.sidebar') as HTMLElement;
    var content = document.querySelector('.content') as HTMLElement;
    var toggleBtn = document.querySelector('.toggle-btn') as HTMLElement;

    if (sidebar.style.display === 'none') {
      sidebar.style.display = 'block';
      toggleBtn.textContent = 'Hide Profile';
    } 
  }
}
