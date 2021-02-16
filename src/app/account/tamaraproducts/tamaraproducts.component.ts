import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, Subscription } from 'rxjs';
import { TamaraproductsServiceService } from '../../account/tamaraproducts/service/tamaraproducts-service.service'

@Component({
  selector: 'app-tamaraproducts',
  templateUrl: './tamaraproducts.component.html',
  styleUrls: ['./tamaraproducts.component.scss']
})
export class TamaraproductsComponent implements OnInit {
  private pSubscription: Subscription;
  public items: Observable<any>;

  constructor(private tamaraService: TamaraproductsServiceService,private angularFireDatabase: AngularFireDatabase) { }

  ngOnInit() {
    //this.items=this.angularFireDatabase.list('/products_2').valueChanges();
    this.pSubscription = this.tamaraService
    .getItem()
    .subscribe(items  => {  
        this.items=items.reverse();
        console.log(this.items);
      }
    );
  }

}
