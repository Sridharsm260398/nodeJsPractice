import { Routes } from '@angular/router';
import { LoginPageComponent } from '../module/login-page/login-page.component';
import { SignupPageComponent } from '../module/signup-page/signup-page.component';
import { HeaderComponent } from '../module/header/header.component';
import { PageNotFoundComponent } from '../module/page-not-found/page-not-found.component';
import { UserDetailsComponent } from '../module/user-details/user-details.component';
import { HomeComponent } from '../module/home/home.component'
import { CartComponent } from '../module/cart/cart.component';
import { ProfileComponent } from '../module/profile/profile.component';
import { AddressComponent } from '../module/address/address.component'
import { OrdersComponent } from '../module/orders/orders.component';
import { CheckoutComponent } from '../module/checkout/checkout.component';
import { EditprofileComponent } from '../module/Editprofile/editprofile.component'
import { LogoutComponent } from '../module/logout/logout.component';
import { AuthGuard } from '../auth/auth.guard';
export const routes: Routes = [
 { path: '', redirectTo: 'home', pathMatch: 'full' },
 {
  path: 'login',
  loadComponent: () =>
      import('../module/login-page/login-page.component')
          .then((c) => c.LoginPageComponent)
},
{
  path: 'signup',
  loadComponent: () =>
      import('../module/signup-page/signup-page.component')
          .then((c) => c.SignupPageComponent)
},
{
  path: 'home',
  loadComponent: () =>
      import('../module/home/home.component')
          .then((c) => c.HomeComponent)
},
//  { path: 'logout', component: LogoutComponent },
//   { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'userDetails', component: UserDetailsComponent , canActivate: [AuthGuard] },
  //{ path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent , canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent , canActivate: [AuthGuard] },
  { path: 'address', component: AddressComponent , canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent , canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard]  },
  { path: 'edit-profile', component: EditprofileComponent, canActivate: [AuthGuard]  },
  { path: '**', component: PageNotFoundComponent },

];
