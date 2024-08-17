import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
 providedIn: 'root'
})
export class CartService {
 private cartItemsSubject = new BehaviorSubject<any[]>([]);
 cartItems$ = this.cartItemsSubject.asObservable();
 addToCart(item: any) {
    const currentItems = this.cartItemsSubject.getValue();
    const existingItem = currentItems.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItemsSubject.next([...currentItems, { ...item, quantity: 1 }]);
    }
  }
  increaseQuantity(item: any) {
    item.quantity++;
    this.cartItemsSubject.next([...this.cartItemsSubject.getValue()]);
  }
  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartItemsSubject.next([...this.cartItemsSubject.getValue()]);
    }
  }
  removeFromCart(item: any) {
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = currentItems.filter(i => i.id !== item.id);
    this.cartItemsSubject.next(updatedItems);
  }
 }
 