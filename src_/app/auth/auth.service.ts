import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { SignUpData, LoginData } from './auth.data.model';
import { environment } from '../../environments/environment';
import { AppService } from '../root/app.services';
import { promises } from 'dns';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private loginSuccess = new Subject<any>();
  private loginError = new Subject<any>();
  loginSuccess$ = this.loginSuccess.asObservable();
  loginError$ = this.loginError.asObservable();
  private authStatusListener = new Subject<boolean>();
  private apiUrl = environment.apiUrl;
  UserID: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private appService: AppService
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(data: any): Observable<any> {
    const authData: SignUpData = {
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.number,
      email: data.email,
      password: data.password,
    };
    return this.http.post(`${this.apiUrl}api/v1/users/signup`, authData);
  }

  login(data: any) {
    const authData: LoginData = {
      email: data.form2email,
      password: data.form2password,
    };
    this.http
      .post<{
        id: any;
        data: any;
        token: string;
        expiresIn: number;
      }>(`${this.apiUrl}api/v1/users/login`, authData)
      .subscribe(
        (response) => {
          this.loginSuccess.next(response);
          const token = response.token;
          this.token = token;
          const UserID = response.data.id;
          this.UserID = UserID;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, UserID);
            //  this.router.navigate(["/"]);
            this.appService.data.user_id = response.data.id;
          }
        },
        (error) => {
          this.loginError.next(error);
          console.log(error);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    // this.router.navigate(["/"]);
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userID: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userID);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
getData(){
 return console.log(this.safeLocalStorageOperation((storage) => storage.getItem('token')))
}
  private getAuthData() {
   // this.getData();
    if (typeof localStorage !== 'undefined') {
      try {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userID = localStorage.getItem('userId');
        this.appService.data.user_id = userID;
        if (!token || !expirationDate) {
          return;
        }
        return {
          token: token,
          expirationDate: new Date(expirationDate),
          UserID: userID,
        };
      } catch (error) {
        console.error('Error accessing localStorage', error);
        return null;
      }
    } else {
      return  null
     
    }
  }
  private safeLocalStorageOperation<T>(
    operation: (storage: Storage) => T
  ): T | null {
    if (typeof localStorage !== 'undefined') {
      try {
        return operation(localStorage);
      } catch (error) {
        console.error('Error accessing localStorage', error);
        return null;
      }
    } else {
      console.warn('localStorage is not available');
      return null;
    }
  }
}
