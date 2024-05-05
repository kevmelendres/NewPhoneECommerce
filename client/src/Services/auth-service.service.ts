import { Inject, Injectable } from '@angular/core';
import { IRegisterModel } from '../Models/registermodel';
import { HttpClient } from '@angular/common/http';
import { ILoginModel } from '../Models/loginmodel';
import { ICurrentUser } from '../Models/currentuser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = 'http://localhost:5064/api/Identity/';
  private isAuthenticated: boolean = false;
  private currentUser: ICurrentUser | null = null;

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
    const localStorage = document.defaultView?.localStorage;

    if (localStorage) {
      if (localStorage.getItem("currentAppUser")) {
        var currentUserLocal = localStorage.getItem("currentAppUser");
        this.currentUser = JSON.parse(currentUserLocal!);
        if (this.currentUser) {
          this.isAuthenticated = true;
        }
      }
    }
  }

  register(data: IRegisterModel) {
    this.http.post<ICurrentUser>(this.baseUrl + "register", data).subscribe(response => console.log("registration success"));
  }

  loginUser(loginData: ILoginModel) {
    this.http.post<ICurrentUser>(this.baseUrl + "login", loginData).subscribe({
      next: currentUserData => {
        this.currentUser = currentUserData;
        localStorage.setItem("currentAppUser", JSON.stringify(this.currentUser));

        if (this.currentUser) {
          this.isAuthenticated = true;
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    localStorage.removeItem("currentAppUser");
    this.isAuthenticated = false;
  }

  getCurrentUser(): ICurrentUser | null {
    return this.currentUser;
  }


}
