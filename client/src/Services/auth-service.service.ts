import { Inject, Injectable } from '@angular/core';
import { IRegisterModel } from '../Models/registermodel';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ILoginModel } from '../Models/loginmodel';
import { ICurrentUser } from '../Models/currentuser';
import { DOCUMENT } from '@angular/common';
import { decode } from 'querystring';
import { BehaviorSubject, EMPTY, EmptyError, Observable, catchError, map, of } from 'rxjs';
import { subscribe } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = 'http://localhost:5064/api/Identity/';
  private _isAuthenticated: boolean = false;
  private currentUser: ICurrentUser | null = null;

  public isAuthenticated = new BehaviorSubject<boolean>(this._isAuthenticated);
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
    const localStorage = document.defaultView?.localStorage;

    if (localStorage) {
      if (localStorage.getItem("currentAppUser")) {
        var currentUserLocal = localStorage.getItem("currentAppUser");
        this.currentUser = JSON.parse(currentUserLocal!);
        console.log(this.currentUser);
        if (this.currentUser) {
          this.isAuthenticated.next(true);
        };

        const sample = this.getLoggedInUser(this.currentUser?.token!).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status == 401) {
              this.logout();
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
            
            console.log("You are logged out!")
          }
        });
      };
    }
  }

  register(data: IRegisterModel) {
    this.http.post<ICurrentUser>(this.baseUrl + "register", data).subscribe(response => console.log("registration success"));
  }

  loginUser(loginData: ILoginModel): Observable<any> {
    return new Observable(subscriber => {
      this.http.post<ICurrentUser>(this.baseUrl + "login", loginData).subscribe({
        next: currentUserData => {
          this.currentUser = currentUserData;
          localStorage.setItem("currentAppUser", JSON.stringify(this.currentUser));

          if (this.currentUser) {
            this.isAuthenticated.next(true);
          }
          console.log(this.currentUser.token);
          subscriber.complete();
        },
        error: error => {
          console.log(error);
        },
      });
    });
  }


  logout(): void {
    localStorage.removeItem("currentAppUser");
    this.isAuthenticated.next(false);
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
