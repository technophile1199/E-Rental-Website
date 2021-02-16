import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../shared/auth.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TamaraproductsServiceService {

  constructor(private authService: AuthService,
    private store: AngularFireDatabase) { }

  public getItem() {
    const items = this.authService.user
      .pipe(
        switchMap((user) => {
          if (user) {
            const remoteUserOrders = `/products_2/${user.uid}/product`;
            return this.store.list(remoteUserOrders).valueChanges();
          } else {
            return of(null);
          }
        })
      );      
    return items;
  }
}