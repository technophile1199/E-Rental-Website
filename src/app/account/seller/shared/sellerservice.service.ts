import { Injectable } from '@angular/core';
import { Observable ,  of ,  from as fromPromise } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Seller } from '../../../models/seller.model';
import { MessageService } from '../../../messages/message.service';
import { AuthService } from '../../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SellerserviceService {

  
    constructor(
      private messageService: MessageService,
      private angularFireDatabase: AngularFireDatabase,
      public authService: AuthService
      ) {
     
  }
  
 public getSeller() {
  
  }

  public getItem() {
    const items = this.authService.user
      .pipe(
        switchMap((user) => {
          if (user) {
            const remoteUserOrders = `/seller`;
            return this.angularFireDatabase.list(remoteUserOrders).valueChanges();
          } else {
            return of(null);
          }
        })
      );
    return items;
  }

  public getp() {
    return this.authService.user
      .pipe(
        switchMap((user) => {
          if (user) {
            const remoteUserOrders = `/seller`;
            return this.angularFireDatabase.list(remoteUserOrders).query.once('value');
          } else {
            return null;
          }
        })
      );
  }
}
