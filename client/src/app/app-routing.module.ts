import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-module/home/home.component';
import { HowtobuyMainComponent } from './howtobuy-module/howtobuy-main/howtobuy-main.component';
import { inject } from '@angular/core';
import { AuthGuardService } from '../Guards/auth-guard.service';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'how-to-buy', component: HowtobuyMainComponent
  },
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
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
