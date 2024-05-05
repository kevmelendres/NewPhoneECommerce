import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-module/home/home.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'shop',
      loadChildren: () => import('./shop-module/shop-module.module').then(m => m.ShopModule)
  },
  {
    path: 'account',
      loadChildren: () => import('./account-module/account.module').then(m => m.AccountModule)
  },




  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
