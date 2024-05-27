import { Injectable, inject } from '@angular/core';
import { AuthService } from '../Services/auth-service.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  _isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuthenticated.subscribe(data => this._isAuthenticated = data);
  }

  canActivate(): boolean {
    if (this._isAuthenticated) {
      this.router.navigate(["/home"]);
    }

    return !this._isAuthenticated;
  }

  canLoad(): boolean {
    return !this._isAuthenticated;
  }

  canMatch(): boolean {
    return !this._isAuthenticated;
  }

  canActivateChild(): boolean {
    return !this._isAuthenticated;
  }

  isAuthenticated(): boolean {
    console.log(this._isAuthenticated);
    return this._isAuthenticated;
  }
}
