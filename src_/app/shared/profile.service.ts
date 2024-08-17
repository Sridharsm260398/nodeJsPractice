import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  uploadPhoto(userId: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    formData.append('userId', userId.toString());
    return this.http.post(`${this.apiUrl}profile/upload`, formData);
  }

  getPhoto(userId: any): Observable<Blob> {
    return this.http.get(`${this.apiUrl}profile/${userId}/photo`, {
      responseType: 'blob',
    });
  }

  deletePhoto(userId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}profile/${userId}/photo`);
  }
}
