import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Params } from '@angular/router/src/shared';

import { Subject, of, Observable } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

import { AuthService } from '../../account/shared/auth.service';
import { CartService } from '../../cart/shared/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { ProductsCacheService } from '../shared/products-cache.service';
import { ProductRatingService } from '../shared/product-rating.service';
import { ProductService } from '../shared/product.service';

import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';
import { auth } from 'firebase';
import * as firebase from 'firebase';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @Input() public product: Product;
  public productLoading: boolean;

  public user: User;
  public productForm: FormGroup;

  public imagesLoaded: string[];
  public activeImageUrl: string;
  public activeImageIndex: number;

  public selectedQuantity: number;

  public ratingCount: number;
  public ratingValues: number[];
  public selectedRating: any;

  public items: Observable<any>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private cartService: CartService,
    private productsCacheService: ProductsCacheService,
    private productService: ProductService,
    private productRatingService: ProductRatingService,
    private modalService: NgbModal,
    private angularFireDatabase: AngularFireDatabase
  ) {}
  

  ngOnInit(): void {
    this.authService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;
      });

    this.ratingValues = [1, 2, 3, 4, 5];
    this.selectedQuantity = 1;
    this.imagesLoaded = [];

    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.getProduct();
      });

      this.getSeller()
      .subscribe(items  => {
        this.items=items.reverse();
      });
      
  }

  public getSeller() {

    const id1 = +this.route.snapshot.paramMap.get('id');

    const items = this.authService.user
      .pipe(
        switchMap((user) => {
          if (user) {
            const remoteUserOrders = `/products_3/${id1}/seller`;
            return this.angularFireDatabase.list(remoteUserOrders).valueChanges();
          } else {
            return of(null);
          }
        })
      );
    return items;
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }


  private getProduct(): void {
    this.productLoading = true;

    const id = +this.route.snapshot.paramMap.get('id');

    this.productsCacheService
      .get(id, this.productService.getProducts())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((product: Product) => {
        if (product) {
          this.product = product;
          this.setupProduct();
          this.productLoading = false;
        } else {
          this.router.navigate(['/404-product-not-found']);
        }
      });
  }

  public onSelectThumbnail(event, index) {
    event.preventDefault();
    this.activeImageUrl = this.product.imageURLs[index];
    this.activeImageIndex = index;
  }

  public onAddToCart() {
    console.log("details");
    var userID=firebase.auth().currentUser.uid;
    this.cartService.addItem(new CartItem(this.product, this.selectedQuantity),userID);
  }

  public onSelectQuantity(event) {
    this.selectedQuantity = <number>+event.target.value;
  }

  public onRate() {
    const rating = parseInt(this.selectedRating, 10);
    this.productRatingService
      .rateProduct(this.product, rating)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.getProduct();
      });
  }

  public onImageLoad(e: any) {
    this.imagesLoaded.push(e.target.src);
  }

  private setupProduct() {
    if (this.product) {
      this.checkCategories();
      this.checkRatings();
      this.activeImageUrl = this.product.imageURLs[0];
      this.activeImageIndex = 0;
    }
  }

  private checkCategories() {
    const categories = Object.keys(this.product.categories).map(
      (category, index, inputArray) => {
        category = index < inputArray.length - 1 ? category + ',' : category;
        return category;
      }
    );
    this.product.categories =
      categories.length >= 1 && !Array.isArray(this.product.categories)
        ? categories
        : [];
  }

  private checkRatings() {
    this.ratingCount = this.product.ratings
      ? Object.keys(this.product.ratings).length
      : 0;

    // check for existing rating
    if (
      this.product.ratings &&
      this.user &&
      Object.keys(this.product.ratings).includes(this.user.uid)
    ) {
      this.selectedRating = this.product.ratings[this.user.uid];
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
