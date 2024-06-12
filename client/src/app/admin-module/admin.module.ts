import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManageDeliveriesComponent } from './manage-deliveries/manage-deliveries.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';


@NgModule({
  declarations: [
    ManageDeliveriesComponent,
    SidebarComponent,
    AdminHomeComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
