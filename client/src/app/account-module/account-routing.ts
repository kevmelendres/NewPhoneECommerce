import { NgModule, inject } from '@angular/core';
import { Routes, RouterModule, mapToCanActivate, mapToCanActivateChild, mapToCanMatch, Router } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from '../../Guards/auth-guard.service';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
  
}
