import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductService } from '../shared/product.service';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-producttable',
  templateUrl: './producttable.component.html',
  styleUrls: ['./producttable.component.scss']
})
export class ProducttableComponent implements OnInit {
  public product: Product[];
  private productSubscription: Subscription;
  constructor(public productService: ProductService) {}

  ngOnInit() {
    this.productSubscription = this.productService
      .getProducts()
      .subscribe((product: Product[]) => {
        if (product) {
          this.product = product.reverse();
        }
      });
  }

}
