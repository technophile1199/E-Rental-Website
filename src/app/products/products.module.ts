import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SharedModule } from '../shared/shared.module';

import { ProductsListComponent } from './products-list/products-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsListItemComponent } from './products-list-item/products-list-item.component';
import { RatingStarsComponent } from './shared/rating-stars/rating-stars.component';

import { FileUploadService } from './shared/file-upload.service';
import { ProductsCacheService } from './shared/products-cache.service';
import { ProductRatingService } from './shared/product-rating.service';

import { SortPipe } from './shared/sort.pipe';
import { FiltercategoriesPipe } from './shared/filtercategories.pipe';
import { ProducttableComponent } from './producttable/producttable.component';
import { FilterByLocationPipe } from './shared/filter-by-location.pipe';

@NgModule({
  declarations: [
    ProductDetailComponent,
    ProductsListComponent,
    ProductsListItemComponent,
    SortPipe,
    RatingStarsComponent,
    FiltercategoriesPipe,
    ProducttableComponent,
    FilterByLocationPipe
  ],
  imports: [SharedModule],
  exports: [
    ProductDetailComponent,
    ProductsListComponent,
    ProductsListItemComponent,
    SortPipe,
    RatingStarsComponent
  ],
  providers: [SortPipe, FileUploadService, ProductsCacheService, ProductRatingService]
})
export class ProductsModule {}
