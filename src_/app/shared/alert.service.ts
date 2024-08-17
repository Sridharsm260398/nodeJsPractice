import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
 providedIn: 'root'
})
export class AlertService {
 constructor() { }
 async confirm(title: string, text: string): Promise<boolean> {
  const result = await Swal.fire({
     title: title,
     text: text,
     icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'Yes',
     cancelButtonText: 'No'
   });
   return result.isConfirmed;
}
 async success(message: string, title: string = 'Success'): Promise<boolean>  {
  const result = await  Swal.fire({
     title: title,
     text: message,
     icon: 'success',
     confirmButtonText: 'OK'
   });
   return result.isConfirmed;
 }
 error(message: string, title: string = 'Error') {
   Swal.fire({
     title: title,
     text: message,
     icon: 'error',
     confirmButtonText: 'OK'
   });
 }
 warning(message: string, title: string = 'Warning') {
   Swal.fire({
     title: title,
     text: message,
     icon: 'warning',
     confirmButtonText: 'OK'
   });
 }
 info(message: string, title: string = 'Info') {
   Swal.fire({
     title: title,
     text: message,
     icon: 'info',
     confirmButtonText: 'OK'
   });
 }
}