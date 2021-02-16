import { Component, OnInit } from '@angular/core';
import { Seller } from '../../models/seller.model';
import { SellerserviceService } from './shared/sellerservice.service';
import { Subscription, from, Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {

  public seller: any;
  private productSubscription: Subscription;
  public items: Observable<any>;
  
    constructor(
      private angularFireDatabase: AngularFireDatabase,
      private sellerService: SellerserviceService
      ) {
      //this.seller = db.list('seller');
      this.items=this.angularFireDatabase.list('/seller').valueChanges();
      this.productSubscription=this.sellerService
      .getItem()
      .subscribe(items  => {
        this.items=items.reverse();
      }
    );

      /*this.sellerService
      .getp()
      .subscribe(items1 => {
        this.items=items1;
      console.log('debugging 2', items1.val());
      this.productSubscription=items1.val();
    })*/
  }

  ngOnInit() {
    
  }

}
