import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable ,  Subscription ,  of } from 'rxjs';

import { MessageService } from '../../messages/message.service';
import { FileUploadService } from '../../products/shared/file-upload.service';
import { ProductService } from '../../products/shared/product.service';
import { ProductsCacheService } from '../../products/shared/products-cache.service';

import { Product } from '../../models/product.model';

// we send and receive categories as {key:true},
// but for the input field we need
// a product with categories of type string
export class DomainProduct extends Product {
  categories: string;
  type: string;
}

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {
  private productSubscription: Subscription;
  private formSubscription: Subscription;
  @ViewChild('photos') photos;
  public productForm: FormGroup;
  public product: DomainProduct;
  public mode: 'edit' | 'add';
  public id;
  public percentage: Observable<number>;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private productService: ProductService,
    public fileUploadService: FileUploadService,
    private productsCacheService: ProductsCacheService,
    private log: MessageService
  ) {}

  ngOnInit(): void {
    this.setProduct();
  }

  private initForm() {
    this.productForm = new FormGroup({
      name: new FormControl(
        this.product && this.product.name,
        Validators.required
      ),
      id: new FormControl(
        {
          value: this.product && this.product.id,
          disabled: true
        },
        [Validators.required, Validators.min(0)]
      ),
      date: new FormControl( {
        value: this.product && this.product.date,
        disabled:true 
      },
      [Validators.required]
      ),
      categories: new FormControl(
        this.product && this.product.categories,
        Validators.required
      ),
      description: new FormControl(
        this.product && this.product.description,
        Validators.required
      ),
      price: new FormControl(this.product && this.product.price, [
        Validators.required,
        Validators.min(0)
      ]),
      priceNormal: new FormControl(this.product && this.product.priceNormal, [
        Validators.required,
        Validators.min(0)
      ]),
      type: new FormControl(this.product && this.product.type,[
        Validators.required
      ]),
      location: new FormControl(this.product && this.product.location,[
        Validators.required
      ])
    });
    this.onFormChanges();
  }

  private setProduct() {
    this.route.params.subscribe((params: Params) => {
      this.id = +this.route.snapshot.paramMap.get('id');
      // if we have an id, we're in edit mode
      if (this.id) {
        console.log("EDIT");
        this.mode = 'edit';
        this.getProduct(this.id);
        this.initForm();
      } else {
        // else we are in add mode
        console.log("ADD");
        this.mode = 'add';
        this.constructProduct();
        this.initForm();
      }
    });
  }

  private constructProduct() {
    const product = this.constructMockProduct();
    product.categories = this.categoriesFromObjectToString(product.categories);
    console.log("CONSTRUCT_PRODUCT");
    this.syncProduct(product);
    this.initForm();
  }

  private getProduct(id): void {
    this.productSubscription = this.productService
      .getProduct(id)
      .subscribe((product) => {
        if (product) {
          product.categories = this.categoriesFromObjectToString(
            product.categories
          );
          this.syncProduct(product);
          this.initForm();
        }
      });
  }

  private onFormChanges() {
    this.formSubscription = this.productForm.valueChanges.subscribe(
      (formFieldValues) => {
        const product = { ...this.product, ...formFieldValues };
        this.syncProduct(product);
      }
    );
  }

  private syncProduct(product): void {
    const id = this.createId(product);
    const imageURLs = this.handleImageURLs(product);
    const reduction = this.calculateReduction(
      product.priceNormal,
      product.price
    );
    const sale = this.checkForSale(reduction);

    this.product = {
      ...product,
      sale,
      reduction,
      id,
      imageURLs
    };
    console.log("SYNC_PRODUCT");
  }

  public onSubmit() {
    this.syncProduct({ ...this.product, ...this.productForm.value });
    const productToSubmit = this.constructProductToSubmit(this.product);
    const files: FileList = this.photos.nativeElement.files;
    if (this.mode === 'add' && files.length > 0) {
      this.addProduct(productToSubmit, files);
      console.log("SUBMIT_ADD");
    } else if (this.mode === 'edit') {
      this.updateProduct(productToSubmit, files);
      console.log("SUBMIT_EDIT");
    } else {
      this.log.addError('Please provide a file for your product');
      return;
    }
  }

  private addProduct(product: Product, files: FileList) {
    console.log("addproduct_1");
    this.productService.addProduct({ product, files }).subscribe(
      (savedProduct: Product) => {
        if (savedProduct.id) {
          console.log("addproduct_2");
          this.product = null;
          console.log("addproduct_3");
          this.router.navigate(['/products']);
        }
        console.log("addproduct_4");
      },
      (error) => {
        console.log("addproduct_5");
        console.log(error);
        this.log.addError('Could not upload your product');
        return of(error);
      }
    );
    console.log("addproduct_6");
  }

  private updateProduct(product: Product, files?: FileList) {
    this.productSubscription.unsubscribe();
    this.productService.updateProduct({ product, files }).subscribe(
      (response: Product) => {
        this.router.navigate(['/products/' + response.id]);
      },
      (error) => this.log.addError('Could not update your product')
    );
  }

  public onDelete() {
    if (this.mode === 'edit') {
      this.productSubscription.unsubscribe();
      this.productService.deleteProduct(this.product).then((res) => {
        this.router.navigate(['/products']);
      });
    } else {
      this.log.addError(`Cannot delete new product`);
    }
  }

  // pure helper functions start here:
  private constructMockProduct() {
    return new Product();
  }

  private constructProductToSubmit(product: DomainProduct): Product {
    return {
      ...product,
      categories: this.categoriesFromStringToObject(product.categories)
    };
  }

  private createId(product: Product): number {
    const randomId = Math.floor(Math.random() * new Date().getTime());
    let id = product.id || randomId;
    if (id === 1) {
      id = randomId;
    }
    return id;
  }

  private categoriesFromObjectToString(categories: {}): string | null {
    // categories: { key: true, key: true} || {}
    if (Object.keys(categories).length === 0) {
      return 'example, category';
    }
    return Object.keys(categories).reduce(
      (result, currentProduct, index, inputArray) => {
        if (index < inputArray.length - 1) {
          return result + currentProduct + ',';
        }
        return result + currentProduct;
      },
      ''
    );
  }

  private categoriesFromStringToObject(categories: string): {} {
    // categories: 'cat1, cat2, cat3' || ''
    if (categories.length === 0) {
      return {};
    }
    return categories
      .split(',')
      .reduce((combinedCategories, currentCategory) => {
        combinedCategories[currentCategory.trim()] = true;
        return combinedCategories;
      }, {});
  }

  private checkForSale(reduction: number): boolean {
    return reduction > 0;
  }

  private calculateReduction(priceNormal: number, price: number): number {
    const reduction = Math.round((priceNormal - price) / priceNormal * 100);
    return reduction > 0 ? reduction : 0;
  }

  private handleImageURLs(product: Product): string[] {
    if (product.imageURLs && product.imageURLs.length > 0) {
      return product.imageURLs;
    }
    return [];
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}
