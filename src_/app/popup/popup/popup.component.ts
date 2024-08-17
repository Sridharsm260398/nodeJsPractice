import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { AppService } from '../../root/app.services';
import { UserService } from '../../shared/user.service';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { AlertService } from '../../shared/alert.service';
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,SharedModule,TranslateModule,TranslatePipe],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  textFieldValue: string ='';
  userData:any;

  constructor(private  userService:UserService, private appService:AppService,private alertService:AlertService) { }
  password: string = '';

  @Output() closed = new EventEmitter<string>();
  @Output() saved = new EventEmitter<string>();
  
  updateProfile(): void {
    let userData ={
      name:this.appService.data.updatedData.name,
     phone_number:this.appService.data.updatedData.phone_number,
     email:this.appService.data.updatedData.email,
     password:this.password
    }
    this.userService.updateUserProfile(this.appService.data.user_id, userData).subscribe(
      (response) => {
        if(response.message){
          this.alertService.success(response.message);
        }else
        {
          this.alertService.warning(response.warning)
        }
      //  alert(response.message);
      },
      (error) => {
       // alert(error.error.error);
        this.alertService.error(error.error.error);
      }
    );
  }
  closePopup() {
    this.closed.emit();
  }

 savePassword() {
    this.saved.emit(this.password);
  }
 /*     var userData ={
     name:this
     phone_number:
     email:
     password:
    }closeDialog(): void {
    this.dialogRef.close(this.textFieldValue);
  }
  onSave(): void {
    // Add logic to save the OTP here
    // You can retrieve the entered OTP using NgModel or form controls
    this.dialogRef.close();
  } */
}