import { NgModule, inject } from '@angular/core';
import { Routes, RouterModule, mapToCanActivate, mapToCanActivateChild, mapToCanMatch, Router } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from '../../Guards/auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { CurrentCartComponent } from './current-cart/current-cart.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [() => inject(AuthGuardService).canActivate()],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [() => inject(AuthGuardService).canActivate()],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [() => inject(AuthGuardService).isAuthenticated()],
  },
  {
    path: 'my-cart',
    component: CurrentCartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
  
}
