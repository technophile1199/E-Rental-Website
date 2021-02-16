import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { Observable ,  of ,  from as fromPromise } from 'rxjs';

import { CartService } from './shared/cart.service';
import { CartItem } from '../models/cart-item.model';
import { database } from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { AuthService } from '../account/shared/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  private cartSubscription: Subscription;
  //public items2: CartItem[];
  public total: number;
  public items: Observable<any>;
  public items2: CartItem;
  public items3: Observable<any>
  // cartItems: any;

  constructor(private cartService: CartService,private angularFireDatabase: AngularFireDatabase) {}

  ngOnInit() {
    this.total=0;
    //this.items = this.cartService.getItems();
    //this.total = this.cartService.getTotal();
    //this.cartSubscription = this.cartService.itemsChanged.subscribe(
    //  (items: CartItem[]) => {
    //    this.items = items;
    //    this.total = this.cartService.getTotal();
    //  }
    //);
    /*this.cartSubscription = this.cartService
    .getItem()
    .subscribe((items: CartItem[]) => {
        this.items = items.reverse();
        this.total = this.cartService.getTotal();
      }
    );*/
    this.items=this.angularFireDatabase.list('/wishlist').valueChanges();
    this.cartSubscription = this.cartService
    .getItem()
    .subscribe(items  => {
        this.items=items.reverse();
        //this.total = this.cartService.getTotal();
        //this.total = items.total;
        //this.total += items.total;
      }
    );
    //console.log(this.total);




  }

  public onClearCart(event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.clearCart();
  }

  public onRemoveItem(event, item: CartItem) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.removeItem(item);
  }

  public increaseAmount(item: CartItem) {
    this.cartService.updateItemAmount(item, item.amount + 1);
  }

  public decreaseAmount(item: CartItem) {
    const newAmount = item.amount === 1 ? 1 : item.amount - 1;
    this.cartService.updateItemAmount(item, newAmount);
  }

  public checkAmount(item: CartItem) {
    this.cartService.updateItemAmount(
      item,
      item.amount < 1 || !item.amount || isNaN(item.amount) ? 1 : item.amount
    );
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}
