import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgFor, NgIf } from '@angular/common';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../shared/alert.service';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { SpinnerService } from '../../shared/spin.service';
@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, TranslateModule,HighlightDirective],
  providers:[SpinnerService],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
})
export class SignupPageComponent implements OnInit {
  formData: any = {}; // Object to store form data
  private apiUrl = environment.apiUrl;
  isSignupEnabled: boolean = false;
  signupForm: any = FormGroup;
  firstName: any;
  lastName: any;
  number: any;
  email: any;
  password: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService:AlertService
  ) {}
  ngOnInit() {
    this.signupForm = this.fb.group({
      //    firstNmae: ['', Validators.required],
      number: ['', [Validators.required, Validators.maxLength(10)]],
      //  password: ['', Validators.required],
    });
  }
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

  checkFields() {
    if (
      this.formData.firstName &&
      this.formData.number &&
      this.formData.email &&
      this.formData.password &&
      this.formData.lastName
    ) {
      this.isSignupEnabled = true;
    } else {
      this.isSignupEnabled = false;
    }
  }
  onSubmit(data: any) {
    this.authService.createUser(data).subscribe(
      (response:any) => {
        if (response) {
          console.log(response);
          // alert(response.message);
          this.alertService.success(response.message).then((result) => {
            if (result) {
              this.navigateTo('/login')
            }
          });
        }
      },
      (error:any) => {
        // alert(error.error.error);
        var message: any = [error.error.error, error.error.message];
        this.alertService.error(message);
      }
    );
    console.log(data);
  }
  /*   onSubmit() {
    const jsonData = JSON.stringify(this.formData);
    console.log(jsonData);
    const postData = {
      first_name: this.formData.firstName,
      last_name: this.formData.lastName,
      email: this.formData.email,
      password:this.formData.password,
      phone_number:this.formData.number,
     };
    // Send POST request to the API endpoint
 fetch(`${this.apiUrl}api/v1/users/signup`, {
 method: 'POST',
 headers: {
   'Content-Type': 'application/json'
 },
 body: JSON.stringify(postData)
})
.then(response => response.json())
.then(data => {
  if(data.error){
    Swal.fire({
      title: 'Error!',
      text: data.error,
      icon: 'error',
      confirmButtonText: 'OK'
    });
}else{
  Swal.fire({
    title: 'Success!',
    text: data.message,
    icon: 'success',
    confirmButtonText: 'OK'
  });
  this.navigateTo('/login')
}
 
})

.catch(error => {
 
 console.error('Error:', error);
});

  }
   */
}
