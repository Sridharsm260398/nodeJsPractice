import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
 providedIn: 'root'
})
export class ExportPdfService {
  private apiUrl = environment.apiUrl
 constructor(private http: HttpClient) { }
 getinvoiceData(orderId:any): Observable<any> {
    const url = `${this.apiUrl}api/v1/users/orders/${orderId}/invoice`;; 
   return this.http.get<any>(url);
 }
}