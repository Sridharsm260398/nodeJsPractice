import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../root/app.services';
import { NgFor, NgIf } from '@angular/common';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment'; 
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../shared/user.service';
import { AlertService } from '../../shared/alert.service';
import { error } from 'console';
@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf,TranslatePipe,TranslateModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent implements OnInit {
  @Output() addressSubmitted: EventEmitter<any> = new EventEmitter();
  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();
  isEditingSave: boolean = false;
  constructor(
    public appService: AppService,
    private userService: UserService,
    private http: HttpClient,
    private alertService:AlertService
  ) {}
  isEditing: boolean = true;
  formDataAdrs: any = {};
  users: any = [];
  ngOnInit() {
    // this.fetchData();
    if (
      this.appService.data.updateData &&
      this.appService.data.mode == 'modify'
    ) {
      this.formDataAdrs = this.appService.data.updateData;
      /*     this.userService.updateAddress(this.formDataAdrs.id, this.formDataAdrs.addressId, this.formDataAdrs).subscribe(() => {
      const index = this.addresses.findIndex(
        (address) => address.addressid === addressId
      );
     
      if (index !== -1) {
        this.addresses[index] = { ...updatedData };
      }
      //this.isEditMode = false;
    }); */
    }
    if (this.appService.data.mode == 'create') {
      this.formDataAdrs = {};
    }
  }
  goToNextStep() {
    this.nextStep.emit();
  }

  goToPrevStep() {
    this.prevStep.emit();
  }
  fetchData() {
    var id = this.appService.data.user_id;
    if (id != null && id != undefined && id != '') {
      this.userService.getAddress(this.appService.data.user_id).subscribe((response) => {
        if (response && Array.isArray(response.data)) {
          this.users = response.data;
        }
      });
   /*    this.http.get<any>('${this.apiUrl}api/v1/users/address/get_address=ID?id=' + id)
        .subscribe((response) => {
          if (response && Array.isArray(response.data)) {
            this.users = response.data;
          }
        }); */
    }
  }
  checkFields() {
    if (
      this.formDataAdrs.first_name &&
      this.formDataAdrs.last_name &&
      this.formDataAdrs.locality &&
      this.formDataAdrs.town_city &&
      this.formDataAdrs.country &&
      this.formDataAdrs.state &&
      this.formDataAdrs.postcode_zip &&
      this.formDataAdrs.address_optional &&
      this.formDataAdrs.email_address &&
      this.formDataAdrs.mobile
    ) {
      this.isEditingSave = true;
    } else {
      this.isEditingSave = false;
    }
  }

  toggleEdit() {
    var btnSave = document.getElementById('btnSaveaddress');
    if (btnSave) {
      btnSave.click();
    }
    // this.appService.data.click = this.isEditingSave;
    this.isEditingSave = !this.isEditingSave;
  }
  saveProfile(data: any) {
    /*     const jsonData = JSON.stringify(this.formDataAdrs);
    console.log(jsonData);
    const postData = {
      id: this.appService.data.user_id,
      first_name: this.formDataAdrs.first_name,
      last_name: this.formDataAdrs.last_name,
      email_address: this.formDataAdrs.email_address,
      mobile: this.formDataAdrs.mobile,
      locality: this.formDataAdrs.locality,
      town_city: this.formDataAdrs.town_city,
      country: this.formDataAdrs.country,
      state: this.formDataAdrs.state,
      postcode_zip: this.formDataAdrs.postcode_zip,
      address_optional: this.formDataAdrs.address_optional,
    };
    fetch('${this.apiUrl}api/v1/users/address/post_address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          Swal.fire({
            title: 'Error!',
            text: data.error,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Success!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        }
      })

      .catch((error) => {
        console.error('Error:', error);
      }); */

    if (this.appService.data.mode == 'create') {
      const postData = {
        user_id: this.appService.data.user_id,
        first_name: this.formDataAdrs.first_name,
        last_name: this.formDataAdrs.last_name,
        email_address: this.formDataAdrs.email_address,
        mobile: this.formDataAdrs.mobile,
        locality: this.formDataAdrs.locality,
        town_city: this.formDataAdrs.town_city,
        country: this.formDataAdrs.country,
        state: this.formDataAdrs.state,
        postcode_zip: this.formDataAdrs.postcode_zip,
        address_optional: this.formDataAdrs.address_optional,
      };
      this.userService
        .createAddress(this.appService.data.user_id, postData)
        .subscribe(
          (response) => {
            if (response) {
              console.log(response);
             // alert(response.message);
              this.alertService.success(response.message)
            }
          },
          (error) => {
           // alert(error.error.error);
           var message:any =[error.error.error,error.error.message]
           this.alertService.error(message)
          }
        );
        this.addressSubmitted.emit(postData)
    }
    if (this.appService.data.mode == 'modify') {
      this.userService
        .updateAddress(
          this.appService.data.user_id,
          this.appService.data.updateData.addressid,
          this.formDataAdrs
        )
        .subscribe(
          (response) => {
            if (response) {
              console.log(response);
           //   alert(response.message);
              this.alertService.success(response.message)
            }
          },
          (error) => {
          //  alert(error.error.error);
            this.alertService.error(error.error.error)
          }
        );
    }
    var btnSave = document.getElementById('btnSaveaddress');
    var addressClick = document.getElementById('addressAdded');
    if (btnSave) {
      btnSave.click();
    }
    setTimeout(() => {
      if (addressClick) {
        addressClick.click();
      }
    }, 1);

  }
}
