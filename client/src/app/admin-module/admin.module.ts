import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManageDeliveriesComponent } from './manage-deliveries/manage-deliveries.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ManageProductsComponent } from './manage-products/manage-products.component';


@NgModule({
  declarations: [
    ManageDeliveriesComponent,
    SidebarComponent,
    AdminHomeComponent,
    ManageProductsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbDatepickerModule,
    FormsModule
  ]
})
export class AdminModule { }
