import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  NgForm,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../shared/user.service';
import { AddressComponent } from '../address/address.component';
import { AppService } from '../../root/app.services';
import { response } from 'express';
import { PopupComponent } from '../../popup/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { OrdersComponent } from '../orders/orders.component';
import { CardComponent } from '../card/card.component';
import { addAbortListener } from 'events';
import { error } from 'console';
import { AlertService } from '../../shared/alert.service';
import { TranslateModule } from '@ngx-translate/core';
import { CartComponent } from '../cart/cart.component';
import { LoadingService } from '../../shared/spinner.service';
import { ProfileService } from '../../shared/profile.service';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    AddressComponent,
    PopupComponent,
    OrdersComponent,
    CardComponent,
    CartComponent,
    TranslateModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  passwordChange: any = {};
  user: any;
  profile: any = {};
  orders: any[] = [];
  wishlist: any[] = [];
  addresses: any[] = [];
  selectedContent: string = '';
  selectedTabIndex = 0;
  isEditing: boolean = false;
  isEditingaddress: boolean = false;
  allselected: boolean = false;
  toggleSideBar: boolean = false;
  users: any | null = [];
  selectedAddressid: any;
  selectAll: any;
  isEditingPWD: boolean = false;
  showingPopup: boolean = false;
  selectedFile: File | null = null;
  userId = this.appService.data.user_id;
  constructor(
    private userService: UserService,
    private appService: AppService,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private profileService: ProfileService,
    private authService:AuthService
  ) {
    /* this.radioForm=this.formBuilder.group({
  selected
}) */
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.onUpload();
  }
  onUpload() {
    if (this.selectedFile) {
      this.profileService.uploadPhoto(this.userId, this.selectedFile).subscribe(
        (response) => {
          console.log(response);
          this.onLoadPhoto();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  onDelete() {
    this.profileService.deletePhoto(this.userId).subscribe(
      (response) => {
        console.log(response);
        this.clearPhoto(); 
      },
      (error) => {
        console.error(error);
      }
    );
  }
  onLoadPhoto() {
    this.profileService.getPhoto(this.userId).subscribe(
      (response) => {
        const url =
           URL.createObjectURL(response); //+ '?timestamp=' + new Date().getTime();
        (document.getElementById('profile-photo') as HTMLImageElement).src =
          url;
      },
      (error) => {
        console.error(error);
        this.clearPhoto();
      }
    );
  }
  clearPhoto() {
    (document.getElementById('profile-photo') as HTMLImageElement).src = '../../../img/avatar.jpg';
  }
  onSubmit(passwordform: NgForm): void {
    if (passwordform.valid) {
      console.log(passwordform.value);
    }
  }
  showPopup(profileData: any) {
    this.appService.data.updatedData = profileData;

    this.showingPopup = true;
  }

  closePopup() {
    this.showingPopup = false;
  }

  savePassword(password: any) {
    console.log('Password saved:', password);
    this.showingPopup = false;
  }
  ngOnInit(): void {
  
    if (
      this.appService.data.user_id != null &&
      this.appService.data.user_id != undefined &&
      this.appService.data.user_id != ''
    ) {
      var id = this.appService.data.user_id;
      this.loadingService.show();
      this.userService.getUserProfile(id).subscribe((response) => {
        if (response && typeof response.data === 'object') {
          this.user = {
            email: response.data.email,
            name: response.data.first_name + ' ' + response.data.last_name,
          };
        }
        this.onLoadPhoto();
      }
    );
      this.userService.getAddress(id).subscribe((response) => {
        if (response && Array.isArray(response.data)) {
          this.addresses = response.data;
        }
      });
      this.loadingService.hide();
      /*    this.http
        .get<any>('${this.apiUrl}api/v1/users/get_profile=ID?id=' + id)
        .subscribe((response) => {
          if (response && typeof response.data === 'object') {
            this.user = {
              email: response.data.email,
              name: response.data.first_name + ' ' + response.data.last_name,
            };
          }
        }); */
      /*   this.http
        .get<any>(
          '${this.apiUrl}api/v1/users/address/get_address=ID?id=' + id
        )
        .subscribe((response) => {
          if (response && Array.isArray(response.data)) {
            this.addresses = response.data;
          }
        }); */
    }

    this.userService.getWishlist().subscribe((wishlist) => {
      this.wishlist = wishlist;
    });
  }
  toggleSidebar1() {
    var sidebar = document.querySelector('.sidebar') as HTMLElement;
    var content = document.querySelector('.content') as HTMLElement;
    var toggleBtn = document.querySelector('.toggle-btn') as HTMLElement;
    this.toggleSideBar = !this.toggleSideBar;
    if (this.toggleSideBar) {
      sidebar.style.display = 'block';
      //content.style.marginLeft = '200px';
      toggleBtn.textContent = 'Hide Profile';
    } else {
      sidebar.style.display = 'none';
      //  content.style.marginLeft = '0';
      toggleBtn.textContent = 'Show Profile';
    }
  }
  toggleSidebar() {
    var sidebar = document.querySelector('.sidebar') as HTMLElement;
    var content = document.querySelector('.content') as HTMLElement;
    var toggleBtn = document.querySelector('.toggle-btn') as HTMLElement;

    if (sidebar.style.display === 'none') {
      sidebar.style.display = 'block';
      toggleBtn.textContent = 'Hide Profile';
    } else {
      sidebar.style.display = 'none';
      toggleBtn.textContent = 'Show Profile';
    }
  }
  onLogout() {
    this.authService.logout();
    console.log('Logging out...');
  }

  toggleEdit() {
    if (this.selectedContent != 'addresses') {
      this.isEditing = !this.isEditing;
    }
    if (this.selectedContent == 'addresses') {
      this.isEditingaddress = !this.isEditingaddress;
    }
    // this.appService.data.click = this.isEditing;
  }
  toggleEditPWD() {
    this.isEditingPWD = true;
  }

  editProfile() {}
  saveProfile(profileData: any) {
    console.log('Profile saved:', profileData);
    this.appService.data.updatedData = profileData;
    this.isEditing = false;
  }
  selectalltoggel() {
    this.allselected = !this.allselected;
  }
  onAddressSelect(event: any, addressid: any) {
    if (addressid === 'all') {
      this.selectAllAddresses(event);
    } else {
      this.selectedAddressid = addressid;
    }
  }
  selectAllAddresses(event: any) {
    if (event.target.checked) {
      this.selectedAddressid = 'all';
      this.addresses.forEach((item) => (item.selected = true));
    } else {
      this.selectedAddressid = null;
      this.addresses.forEach((item) => (item.selected = false));
    }
  }
  /*   onAddressSelect(addressId: any): void {
    this.selectedAddressid = addressId;
  }
selectAllAddresses() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedAddressid = this.addresses.map(address => address.addressid);
    } else {
      this.selectedAddressid = null;
    }
  } */
  editAddress(addressId: any, ID: any, address: any) {
    console.log(`addressID:${addressId}, Id:${ID}`);
    this.appService.data.mode = 'modify';
    this.appService.data.updatedData = { ...address };
  }
  setMode() {
    this.appService.data.mode = 'create';
  }
  saveAddress() {
    //  console.log('Address saved:', this.address);
    this.isEditing = false;
    this.isEditingaddress = false;
  }
  async deleteAddresswiithID(): Promise<void> {
    const isConfirmed = await this.alertService.confirm(
      'Are you sure?',
      'Do you really want to delete this Address?'
    );
    if (isConfirmed) {
      this.userService
        .deleteAddressWithID(this.appService.data.user_id)
        .subscribe(
          (response) => {
            this.addresses = this.addresses.filter(
              (address) => address.user_id !== this.appService.data.user_id
            );
            // alert(response.message);
            this.alertService.success(response.message);
            if (this.selectedAddressid === this.appService.data.user_id) {
              this.selectedAddressid = null;
            }
          },
          (error) => {
            this.alertService.error(error.error.error);
            //   alert(error.error.error);
          }
        );
    }
  }
  async deleteAddress(id: any, addressId: any, deleteData: any): Promise<void> {
    const isConfirmed = await this.alertService.confirm(
      'Are you sure?',
      'Do you really want to delete this Address?'
    );
    if (isConfirmed) {
      this.userService.deleteAddress(id, addressId, deleteData).subscribe(
        (response) => {
          this.addresses = this.addresses.filter(
            (address) => address.addressid !== addressId
          );
          // alert(response.message);
          this.alertService.success(response.message);
          if (this.selectedAddressid === addressId) {
            this.selectedAddressid = null;
          }
        },
        (error) => {
          this.alertService.error(error.error.error);
          //   alert(error.error.error);
        }
      );
    }
  }
  updateAddress(id: any, addressId: any, updatedData: any): void {
    this.appService.data.updateData = updatedData;
  }

  savePAN() {
    // console.log('PAN card saved:', this.pan);
    this.isEditing = false;
  }

  savePWD() {
    if (
      this.passwordChange.newPwd == undefined ||
      this.passwordChange.confirmPwd == undefined ||
      this.passwordChange.currentPwd == undefined ||
      this.passwordChange.newPwd == '' ||
      this.passwordChange.confirmPwd == '' ||
      this.passwordChange.currentPwd == ''
    ) {
      this.alertService.error('Please fill all required fields');
      return;
    }
    if (this.passwordChange.newPwd == this.passwordChange.confirmPwd) {
      this.userService
        .updatePassword(this.appService.data.user_id, {
          password: this.passwordChange.newPwd,
          old_Pwd: this.passwordChange.currentPwd,
        })
        .subscribe(
          (response) => {
            this.alertService.success(response.message);
            this.isEditingPWD = false;
          },
          (error) => {
            this.alertService.error(error.error.error);
            this.isEditingPWD = true;
          }
        );
    } else {
      this.alertService.error(
        'Confirm password is not matching with the New password'
      );
      this.isEditingPWD = true;
    }
  }
  showContent(content: string) {
    this.showingPopup = false;
    var id = this.appService.data.user_id;
    if (
      this.appService.data.user_id != null &&
      this.appService.data.user_id != undefined &&
      this.appService.data.user_id != ''
    ) {
      if (content == 'addresses') {
        this.userService
          .getAddress(this.appService.data.user_id)
          .subscribe((response) => {
            if (response && Array.isArray(response.data)) {
              this.addresses = response.data;
            }
          });
        /*   this.http
          .get<any>(
            '${this.apiUrl}api/v1/users/address/get_address=ID?id=' + id
          )
          .subscribe((response) => {
            if (response && Array.isArray(response.data)) {
              this.addresses = response.data;
            }
          }); */
      }
      if (content == 'profile') {
        this.userService.getUserProfile(id).subscribe((response) => {
          if (response && typeof response.data === 'object') {
            this.profile = {
              email: response.data.email,
              name: response.data.first_name + ' ' + response.data.last_name,
              phone_number: response.data.phone_number,
            };
          }
        });
        /*        this.http
          .get<any>(
            '${this.apiUrl}api/v1/users/get_profile=ID?id=' + id
          )
          .subscribe((response) => {
            if (response && typeof response.data === 'object') {
              this.profile = {
                email: response.data.email,
                name: response.data.first_name + ' ' + response.data.last_name,
                phone_number: response.data.phone_number,
              };
            }
          }); */
      }
    }
    this.selectedContent = content;
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }
  isObjectEmpty(obj: {}) {
    return Object.keys(obj).length === 0;
  }
  updateProfile(userData: any): void {
    this.userService
      .updateUserProfile(this.appService.data.user_id, userData)
      .subscribe(
        (response) => {
          //    alert(response.message);
          this.alertService.success(response.message);
        },
        (error) => {
          //alert(error.error.error);
          this.alertService.error(error.error.error);
        }
      );
  }
}
