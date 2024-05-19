import { Inject, Injectable } from '@angular/core';
import { IRegisterModel } from '../Models/registermodel';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ILoginModel } from '../Models/loginmodel';
import { ICurrentUser } from '../Models/currentuser';
import { DOCUMENT } from '@angular/common';
import { decode } from 'querystring';
import { EMPTY, EmptyError, Observable, catchError, of } from 'rxjs';

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
        console.log(this.currentUser);
        if (this.currentUser) {
          this.isAuthenticated = true;
        };

        const sample = this.getLoggedInUser(this.currentUser?.token!).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status == 401) {
              return of("Unauthenticated");
            }
            return of("Authenticated");
          })
        );

        sample.subscribe(data => {
          if (data == "Authenticated") {
            console.log("You are logged in!")
          }
          if (data == "Unauthenticated") {
            this.logout();
            console.log("You are logged out!")
          }
        });
      };
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

        console.log(this.currentUser.token);
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


  getLoggedInUser(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get<any>(this.baseUrl + "validate-token", {headers: headers});
  }
}
