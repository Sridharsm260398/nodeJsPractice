import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { AppService } from '../../root/app.services';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../../shared/cart.service';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule,TranslateModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
 
  orders:any
  constructor(
    private userService: UserService,
    private appService: AppService,
    private cartService:CartService,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.userService.getOrderHistory().subscribe((orders) => {
      this.orders = orders;
    });
  }

  goToNextStep() {
    this.nextStep.emit();
  }

}
