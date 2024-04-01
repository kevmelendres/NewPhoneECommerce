import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductComponent } from './product/product.component';
import { SidebarFilterComponent } from './sidebar-filter/sidebar-filter.component';
import { PaginationComponent } from './pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { TopFilterComponent } from './top-filter/top-filter.component';


@NgModule({
  declarations: [
    ProductComponent,
    SidebarFilterComponent,
    ShopComponent,
    PaginationComponent,
    TopFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ProductComponent,
    SidebarFilterComponent,
    PaginationComponent,
    ShopComponent
  ]
})
export class ShopModule { }
