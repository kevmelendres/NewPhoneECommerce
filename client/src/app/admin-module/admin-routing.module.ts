import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageDeliveriesComponent } from './manage-deliveries/manage-deliveries.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';


const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
  },
  {
    path: 'manage-deliveries',
    component: ManageDeliveriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
