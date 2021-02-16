import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from '../../account/shared/auth.service';
import { CartService } from '../../cart/shared/cart.service';

import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';
import * as firebase from 'firebase';
import { ProductService } from '../shared/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list-item',
  templateUrl: './products-list-item.component.html',
  styleUrls: ['./products-list-item.component.scss']
})
export class ProductsListItemComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  @Input() public product: Product;
  @Input() public displayMode: string;
  public user: User;
  public imageLoading: boolean;
  private productSubscription: Subscription;
  cartItems: firebase.database.DataSnapshot;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private router:Router
  ) {}

  ngOnInit() {
    this.imageLoading = true;
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.cartService
    .getItem1()
    .subscribe(items  => {
      console.log('debugging', items.val());
      this.cartItems = items;
      }
    );
    this.productService
    .getp()
    .subscribe(items1 => {
      console.log('debugging 2', items1.val());
      this.productSubscription=items1.val();
    })
  }

  public onAddToCart() {
    console.log("list");
    if(this.cartItems.hasChild(this.product.id+"")){
      console.log("debugging", "cart ma already che",this.cartItems.child(this.product.id+"").val().amount + 1)
      this.cartService.updateItemAmount(new CartItem(this.product),this.cartItems.child(this.product.id+"").val().amount + 1);
    } else {
      // console.log("debugging", "cart to nathi")
var userID=firebase.auth().currentUser.uid;
    this.cartService.addItem(new CartItem(this.product, 1),userID);
    }
    
  }

  public onImageLoad() {
    this.imageLoading = false;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
