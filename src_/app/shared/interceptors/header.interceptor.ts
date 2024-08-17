import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
  HttpInterceptor,
  HttpHandler,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { AppService } from '../../root/app.services';

declare const top: any;

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private authService:AuthService,private appService:AppService ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // const user: any = localStorage.getItem('userId');
    // const token: any = localStorage.getItem('token');
    const mode: any = 'dev';
    const newReq = req.clone({
      headers: req.headers
        .set('lang', 'en')
        .set('app-mode', mode)
        .set('userId', this.appService.data.user_id)
        .set('website', 's-cart')
        .set('authCode', 'secure-id-'+ this.appService.data.user_id),
    });

    return next.handle(newReq);
  }
}
