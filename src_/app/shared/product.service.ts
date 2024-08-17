// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { AnyMxRecord } from 'dns';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  items: any[]=[];
  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  filterData(value:string): Observable<any>{
    if(value ==""){
      return this.http.get<any[]>('https://fakestoreapi.com/products/')
    } else 
    {
   return this.http.get<any[]>(`https://fakestoreapi.com/products/category/${value}`)
    }
  }
  getallProductsList(currentPage:number,pageSize:number,filterValue:AnyMxRecord): Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}api/v1/products/getallProducts?page=${currentPage}&pageSize=${pageSize}&filter=${filterValue}`)
  }
}
