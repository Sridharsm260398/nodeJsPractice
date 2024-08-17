import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AddressComponent } from '../address/address.component';
import { CardComponent } from '../card/card.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileComponent } from '../profile/profile.component';
import { UserService } from '../../shared/user.service';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../shared/alert.service';
import { AppService } from '../../root/app.services';
import { CartService } from '../../shared/cart.service';
import { CartComponent } from '../cart/cart.component';
import { InvoiceService } from '../../shared/invoice.service';
import { ExportPdfService } from '../../shared/exportPdf.service';
import { PdfService } from '../../shared/pdf.service';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    AddressComponent,
    CartComponent,
    CardComponent,
    OrderSummaryComponent,
    TranslateModule,
    ProfileComponent,
  ],
  providers:[PdfService],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  isAddressOpen: boolean = true;
  isCardsOpen: boolean = true;

  currentStep: number = 1;
  deliveryAddressForm: FormGroup;
  orderSummaryForm: FormGroup;
  paymentDetailsForm: FormGroup;
  orderConfirmationForm: FormGroup;
  cartItems: any;
  savedAddresses: any;
  savedCards: any;
  added_card: any;
  constructor(
    private fb: FormBuilder,
    public appService: AppService,
    private userService: UserService,
    private cartService: CartService,
    private http: HttpClient,
    private invoiceService: InvoiceService,
    private alertService: AlertService,
    private exportPdfService: ExportPdfService,
    private pdfService: PdfService
  ) {
    this.deliveryAddressForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    });
    this.orderSummaryForm = this.fb.group({
      // Order summary fields
    });
    this.paymentDetailsForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{16}$')],
      ],
      expirationDate: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])/?([0-9]{4}|[0-9]{2})$'),
        ],
      ],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    });
    this.orderConfirmationForm = this.fb.group({
      // Order confirmation fields
    });
  }
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
    if (this.appService.data.user_id != undefined) {
      // Fetch saved addresses
      this.userService
        .getAddress(this.appService.data.user_id)
        .subscribe((response) => {
          if (response && Array.isArray(response.data)) {
            this.savedAddresses = response.data;
            console.log(response);
          }
        });

      // Fetch saved cards
      this.userService
        .getSavedCardsetailswithID(this.appService.data.user_id)
        .subscribe((response) => {
          if (response && Array.isArray(response.data)) {
            this.added_card = response.data;
            console.log(response);
          }
        });
    }
  }
  downloadInvoice(orderId: string) {
    this.invoiceService.downloadInvoice(orderId).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${orderId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download error:', error);
      }
    );
  }

  downloadPDF(orderID:any): void {
    this.exportPdfService.getinvoiceData(orderID).subscribe((data) => {
      this.pdfService.generatePDF(data);
    });
  }
  toggleSection(section: string) {
    if (section === 'address') {
      this.isAddressOpen = !this.isAddressOpen;
    } else if (section === 'cards') {
      this.isCardsOpen = !this.isCardsOpen;
    }
  }
  checkout() {
    // alert('checkout success!!');
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
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
  calculateTotalPrice() {
    return this.calculateGrandTotal() + 40;
  }
  onNextStep(): void {
    if (this.currentStep < 3) {
      // Assuming 3 steps in total
      this.currentStep++;
    }
  }

  onPrevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onAddressSubmitted(addressData: any) {
    // Handle address submission if needed
    this.onNextStep();
  }

  onCardSubmitted(cardData: any) {
    // Handle card submission if needed
    this.onNextStep();
  }
}
