import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-module/home/home.component';
import { HowtobuyMainComponent } from './howtobuy-module/howtobuy-main/howtobuy-main.component';
import { PageNotAvailableComponent } from './page-not-available/page-not-available.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'how-to-buy', component: HowtobuyMainComponent
  },
  {
    path: 'events', component: PageNotAvailableComponent
  },
  {
    path: 'about-us', component: PageNotAvailableComponent
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop-module/shop-module.module').then(m => m.ShopModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account-module/account.module').then(m => m.AccountModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-module/admin.module').then(m => m.AdminModule)
  },



  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
