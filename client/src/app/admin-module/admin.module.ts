import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManageDeliveriesComponent } from './manage-deliveries/manage-deliveries.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';


@NgModule({
  declarations: [
    ManageDeliveriesComponent,
    SidebarComponent,
    AdminHomeComponent,
    ManageProductsComponent,
    ManageUsersComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbDatepickerModule,
    FormsModule
  ]
})
export class AdminModule { }
