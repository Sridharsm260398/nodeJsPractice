import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../shared/cart.service';
import { AppService } from '../../root/app.services';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../shared/user.service';
import { AlertService } from '../../shared/alert.service';
import { FormsModule } from '@angular/forms';
import { error } from 'console';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule,TranslatePipe,TranslateModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Output() cardSubmitted: EventEmitter<any> = new EventEmitter();
  isEditing: boolean = false;
  added_card: any;
  formDatacard: any = { id: this.appService.data.user_id };
  isEditMode: boolean = false;
  constructor(
    private userService: UserService,
    private appService: AppService,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    /*     this.userService.getSavedCardsetails().subscribe((response) => {
      if (response && Array.isArray(response.data)) {
        this.added_card = response.data;
        console.log(response);
      }
    }); */
    if(this.appService.data.user_id !=undefined){
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
  checkFields() {
    if (
      this.formDatacard.card_holder_name &&
      this.formDatacard.expiry_date &&
      this.formDatacard.card_number &&
      this.formDatacard.cvv
    ) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.formDatacard = { user_id: this.appService.data.user_id };
  }
  async deleteCard(id: any, cardID: any, deleteData: any): Promise<void> {
    const isConfirmed = await this.alertService.confirm(
      'Are you sure?',
      'Do you really want to delete this card?'
    );
    if (isConfirmed) {
      this.userService.deleteCardetails(id, cardID, deleteData).subscribe(
        (response) => {
          this.added_card = this.added_card.filter(
            (card: { card_id: any }) => card.card_id !== cardID
          );
          // alert(response.message);
          this.alertService.success(response.message);
        },
        (error) => {
          //  alert(error.error.error);\
          this.alertService.error(error.error.error);
        }
      );
    }
  }
  savedData(value: string) {
    if(this.appService.data.user_id !=undefined){
    this.userService.SaveCardsetails(value).subscribe(
      (response) => {
        if (response) {
          console.log(response);
          //    alert(response.message);
          this.alertService.success(response.message);
          return;
        }
      },
      (error) => {
        // alert(error.error.error);
        var message:any =[error.error.error,error.error.message]
        this.alertService.error(message);
        return;
      }
    );
    setTimeout(() => {
      this.userService
      .getSavedCardsetailswithID(this.appService.data.user_id)
      .subscribe((response) => {
        if (response && Array.isArray(response.data)) {
          this.added_card = response.data;
          console.log(response);
          this.cardSubmitted.emit(response.data)
        }
      });
    }, 1000);
    
    this.isEditing = !this.isEditing;
  }
}
}
