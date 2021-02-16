import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';
import { Observable, of, from as fromPromise, observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MessageService } from '../../messages/message.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../account/shared/auth.service';
import { User } from 'firebase';
import * as firebase from 'firebase';

@Injectable()
export class CartService {
  // Init and generate some fixtures
  private cartItems: CartItem[]
  public itemsChanged: EventEmitter<CartItem[]> = new EventEmitter<CartItem[]>();
  public total: number;
  public items: Observable<any>;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private store: AngularFireDatabase) {
    this.cartItems = [];
  }

  public getItems() {
    return this.cartItems.slice();

  }
  public getItem() {
    const items = this.authService.user
      .pipe(
        switchMap((user) => {
          if (user) {
            const remoteUserOrders = `/wishlist/${user.uid}/product`;
            return this.store.list(remoteUserOrders).valueChanges();
          } else {
            return of(null);
          }
        })
      );
      var rawItems = [];
        items.subscribe(countries => {
          rawItems = countries;
          // console.log('debugging', "inside");
      })
      // console.log('debugging', "done", rawItems);
      
    return items;
  }
  public getItem1() {
    return this.authService.user
      .pipe(
        switchMap((user) => {
          if (user) {
            const remoteUserOrders = `/wishlist/${user.uid}/product`;
            return this.store.list(remoteUserOrders).query.once('value');
          } else {
            return null;
          }
        })
      );
      
      
    // return items.toPromise();
  }

  // Get Product ids out of CartItem[] in a new array
  private getItemIds() {
    // this.authService.user.
    var t = this.getItem().map(cartItem => cartItem.product.id);
    console.log("debugging", t);
    return t;
    // return this.getItem()
    //return this.getItem().subscribe(sna)
  }

  public addItem(item: CartItem, user: string) {
    // If item is already in cart, add to the amount, otherwise push item into cart
    const orderWithMetaData = {
      ...item,
      ...this.constructOrderMetaData(item)
    };
    // if (this.getItemIds().includes(item.product.id)) {
    //   this.cartItems.forEach(function (cartItem) {
    //     if (cartItem.product.id === item.product.id) {
    //       cartItem.amount += item.amount;
    //     }
    //   });
    //   this.messageService.add('Amount in WishList changed for: ' + item.product.name);
    // } else {
    //   this.cartItems.push(item);

       const databaseOperation = firebase.
         database().ref(`wishlist/${user}/product/${item.product.id}`)
         .set(orderWithMetaData)
         .then((response) => response, (error) => error);

       this.messageService.add('Added to WishList: ' + item.product.name);

       return fromPromise(databaseOperation);
    // }
    //this.itemsChanged.emit(this.cartItems.slice());
  }

  /*public addItems(items: CartItem[]) {
    items.forEach((cartItem) => {
      this.addItem(cartItem);
    });
  }*/

  private constructOrderMetaData(cart: CartItem) {
    return {
      number: (Math.random() * 10000000000).toString().split('.')[0],
      date: new Date().toString()
    };
  }

  public removeItem(item: CartItem) {
    var user = firebase.auth().currentUser.uid;
    //const indexToRemove = this.cartItems.findIndex(element => element === item);
    //this.cartItems.splice(indexToRemove, 1);
    //this.itemsChanged.emit(this.cartItems.slice());

    const databaseOperation = this.store
      .list(`wishlist/${user}/product/${item.product.id}`)
      .remove()
      .then((response) => response, (error) => error);

    this.messageService.add('Deleted from WishList: ' + item.product.name);

    return fromPromise(databaseOperation);
  }

  public updateItemAmount(item: CartItem, newAmount: number) {
    //this.cartItems.forEach((cartItem) => {
    //  if (cartItem.product.id === item.product.id) {
    //    cartItem.amount = newAmount;
    //  }
    //});
    //this.itemsChanged.emit(this.cartItems.slice());
    firebase.database().ref(`/wishlist/${firebase.auth().currentUser.uid}/product/${item.product.id}`).update({
      amount: newAmount
    });
    this.messageService.add('Updated amount for: ' + item.product.name);
  }

  public clearCart() {
    var user = firebase.auth().currentUser.uid;
    this.cartItems = [];
    this.itemsChanged.emit(this.cartItems.slice());

    const databaseOperation = this.store
      .list(`wishlist/${user}/product`)
      .remove()
      .then((response) => response, (error) => error);

    this.messageService.add('Cleared WishList');

    return fromPromise(databaseOperation);
  }

  public getTotal() {
    /*let total1 = 0;
    this.cartItems.forEach((cartItem) => {
      total += cartItem.amount * cartItem.product.price;
    });
    return total;*/

    /*this.items=this.store.list('/wishlist').valueChanges();
    this.items.subscribe(item => {
      this.total=item.uid;
      console.log(item.uid);
    });*/
    //return this.total;
  }
}