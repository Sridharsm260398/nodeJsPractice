/* import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
 providedIn: 'root'
})
export class LanguageService {
 private currentLanguage = 'en';
 constructor(private translate: TranslateService) {
  this.translate.setDefaultLang(this.currentLanguage);
  this.translate.use(this.currentLanguage);
 }
 setLanguage(language: string): void {
   this.currentLanguage = language;
   this.translate.use(language);
   //this.translate.translations`.${language}`
 }
} */
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang: BehaviorSubject<string> = new BehaviorSubject<string>('en');

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  setLanguage(lang: string) {
    this.translate.use(lang).subscribe(() => {
      this.currentLang.next(lang);
    });
  }

  getCurrentLanguage(): Observable<string> {
    return this.currentLang.asObservable();
  }
}
