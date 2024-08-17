import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
  DoCheck,
  AfterViewChecked
} from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { CartService } from '../../shared/cart.service';
import { NgIf, NgFor } from '@angular/common';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../shared/language.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    TranslateModule
    
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy,DoCheck  {
  //@Input() cartItems: any[];
  private langSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;
  cartItems: any[] = [];
  currentLang!: string;

  constructor(
    private cartService: CartService,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private translateService:TranslateService
  ) { }

  ngOnInit(): void {
    // Subscribe to cart items changes
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      //this.cdr.markForCheck();
    });
/*       this.langSubscription = this.languageService.getCurrentLanguage().subscribe(lang => {
        this.currentLang = lang;
        this.translateService.use(lang); // Ensure TranslateService uses the new language
        this.cdr.detectChanges();
        console.log(`AccountComponent: detected language change to ${lang}`);
      });  */
    

    }
/* ngAfterViewChecked(){
  this.langSubscription = this.languageService.getCurrentLanguage().subscribe(lang => {
    this.translateService.use(lang).subscribe(() => {
      this.cdr.detectChanges(); // Force change detection
    });
  })
} */
ngDoCheck() {
 // this.cdr.detectChanges(); 
} 
  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
   /*  if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    } */
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  increaseQuantity(item: any) {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: any) {
    this.cartService.decreaseQuantity(item);
  }

  calculateGrandTotal(): number {
    let grandTotal = 0;
    for (const item of this.cartItems) {
      grandTotal += item.price * item.quantity;
    }
    return grandTotal;
  }

  checkout() {
   // alert('checkout success!!');
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
  }
}
