import { Component, ViewChild } from '@angular/core';
import {
  NgForm,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { AppService } from '../../root/app.services';
import {} from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../shared/alert.service';
import { error } from 'console';
import { SpinnerService } from '../../shared/spin.service';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, TranslateModule, SpinnerComponent],
  providers: [SpinnerService],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  isSignupEnabled: any = false;
  isLoad: boolean = false;
  private apiUrl = environment.apiUrl;
  constructor(private appService: AppService, private router: Router,private alertService:AlertService,private authService:AuthService) {}
  ngOnInit(): void {}
  //     // });
  //     this.signupForm.form.patchValue({
  //       userData: {
  //         username: suggestedName
  //       }
  //     });
  //   }
  //   // onSubmit(form: NgForm) {
  //   //   console.log(form);
  //   // }
  //   onSubmit() {
  //     this.submitted = true;
  //     this.user.username = this.signupForm.value.userData.username;
  //     this.user.email = this.signupForm.value.userData.email
  //     this.signupForm.reset();
  //   }

  checkFields() {
    if (
      this.formData.form2email &&
      this.formData.form2tel &&
      this.formData.form2password
    ) {
      this.isSignupEnabled = true;
    } else {
      this.isSignupEnabled = false;
    }
  }
  formData: any = {};
  navigateTo(route: string) {
    // Use Angular router to navigate to the corresponding route
    this.router.navigate([`/${route}`]);
  }
  showPassword() {
    const passwordField = document.querySelector('.password-field') as any;
    const eyeIcon = document.querySelector('.eye-icon') as any;
    const fieldType = passwordField.getAttribute('type');
    if (fieldType === 'password') {
      passwordField.setAttribute('type', 'text');
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordField.setAttribute('type', 'password');
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }
  onSubmit(data: any) {
    //this.isLoad =true;
    this.authService.login(data);
    this.authService.loginSuccess$.subscribe(response=>{
      //this.isLoad =false;
      this.alertService.success(response.message).then((result) => {
        if (result) {
          this.navigateTo('/home')
        }
      });
    })
    this.authService.loginError$.subscribe(error=>{
      //this.isLoad =false;
      var message: any = [error.error.error, error.error.message];
      this.alertService.error(message)
      
    })
  console.log(data);
  }
  /*   onSubmit() {
    //const jsonData = JSON.stringify();
    // console.log(jsonData);
    const postData = {
      email: this.formData.form2email,
      password: this.formData.form2password,
    };
    //this.isLoad =true;
    // Send POST request to the API endpoint
    fetch(`${this.apiUrl}api/v1/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          //this.isLoad =false;
          Swal.fire({
            title: 'Error!',
            text: data.error,
            icon: 'error',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              //this.isLoad =false;
            }
          });;
        } else {
          //this.isLoad =false;
          Swal.fire({
            title: 'Success!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.appService.data.user_id = data.data.id;
              this.navigateTo('/home');
              //this.isLoad =false;
            }
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        //this.isLoad =false;
      });
  } */
}
