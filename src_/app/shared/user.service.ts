// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class UserService {
  items: any[]=[];
  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  updateUserProfile(id: string, userData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}api/v1/users/update_profile=ID?user_id=${id}`, userData);
  }
  filterData(value:string): Observable<any>{
    if(value ==""){
      return this.http.get<any[]>('https://fakestoreapi.com/products')
    } else 
    {
   return this.http.get<any[]>(`https://fakestoreapi.com/products/category/${value}`)
    }
  }
  getUser(): Observable<any> {
    return of({
      name: 'Manoj T',
      email: 'manoj@tcs.com',
    });
  }
  updatePassword(id:any,dataPwd:any):Observable<any>{
    return this.http.patch<any>(`${this.apiUrl}api/v1/users/passwordChange?user_id=${id}`,dataPwd)
  }
  getAddress(id:any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}api/v1/users/address/get_address=ID?user_id=${id}`)
}
  getUserProfile(id:any): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}api/v1/users/get_profile=ID?user_id=${id}`)
  }
  getSavedCardsetailswithID(id:any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}api/v1/users/get_creditdebitID?user_id=${id}`)
}
  SaveCardsetails(value:string): Observable<any>{
      return this.http.post<any>(`${this.apiUrl}api/v1/users/creditdebit_post`,value)
  }
 deleteCardetails(Id:any,cardID:any,deleteData:any): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}api/v1/users/delete_creditdebitID?user_id=${Id}&card_id=${cardID}`,deleteData)
}
  deleteAddress(Id:any,addressid:any,deleteData:any):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}api/v1/users/address/delete_single_address=aid?user_id=${Id}&addressid=${addressid}`,deleteData)
  }
  deleteAddressWithID(Id:any):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}api/v1/users/address/delete_address=ID?user_id=${Id}`)
  }
  getOrderHistory(): Observable<any[]> {
  /*   return of([
      { orderId: '12345', date: '2024-05-01', totalAmount: 100 },
      { orderId: '54321', date: '2024-04-25', totalAmount: 150 }
    ]); */
    return this.http.get<any[]>('https://fakestoreapi.com/products')
  }
  updateAddress(Id:any,addressid:any,updateData:any):Observable<any>{
    return this.http.patch<any>(`${this.apiUrl}api/v1/users/address/update_single_address=aid?user_id=${Id}&addressid=${addressid}`,updateData)
  }
  createAddress(Id:any,addressData:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}api/v1/users/address/post_address?user_id=${Id}`,addressData)
  }

  getWishlist(): Observable<any[]> {
    return of([
      { productId: '789', name: 'Product 1', price: 50 },
      { productId: '987', name: 'Product 2', price: 75 }
    ]);
  }

/*   getSavedAddresses(): Observable<any[]> {
    return of([
      { addressId: '1', street: '123 ajampura', city: 'Chickmangaluru', country: 'India', zip: '12345', isDefault: true },
      { addressId: '2', street: '456 ajampura', city: 'Chickmangaluru', country: 'India', zip: '54321', isDefault: false }
    ]);
  } */
}
