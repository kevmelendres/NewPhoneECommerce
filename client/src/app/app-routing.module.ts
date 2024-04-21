import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop-module/shop.component';
import { HomeComponent } from './home-module/home/home.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'shop',
      loadChildren: () => import('./shop-module/shop-module.module').then(m => m.ShopModule)
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
