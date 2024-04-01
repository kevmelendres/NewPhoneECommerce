import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop-module/shop.component';


const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'shop', component: ShopComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
