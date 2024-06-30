import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageDeliveriesComponent } from './manage-deliveries/manage-deliveries.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';


const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
  },
  {
    path: 'manage-deliveries',
    component: ManageDeliveriesComponent,
  },
  {
    path: 'manage-products',
    component: ManageProductsComponent,
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
