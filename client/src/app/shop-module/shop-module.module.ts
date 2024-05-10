import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductComponent } from './product/product.component';
import { SidebarFilterComponent } from './sidebar-filter/sidebar-filter.component';
import { PaginationComponent } from './pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { TopFilterComponent } from './top-filter/top-filter.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { NgbPopoverModule, NgbToastModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ShopRoutingModule } from './shop-routing.module';
import { AccountRoutingModule } from '../account-module/account-routing';
import { AppModule } from '../app.module';


@NgModule({
  declarations: [
    ProductComponent,
    SidebarFilterComponent,
    ShopComponent,
    PaginationComponent,
    TopFilterComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    NgbPopoverModule,
    NgbTooltip,
    ShopRoutingModule
  ],
  exports: [
  ]
})
export class ShopModule { }
