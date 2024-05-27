import { Inject, Injectable } from '@angular/core';
import { IRegisterModel } from '../Models/registermodel';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { ILoginModel } from '../Models/loginmodel';
import { ICurrentUser } from '../Models/currentuser';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { ICurrentUserProfile, ICurrentUserProfileC } from '../Models/currentuserprofile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = 'http://localhost:5064/api/Identity/';
  private _isAuthenticatedInit: boolean = false;
  private currentUser: ICurrentUser | null = null;
  public currentUserProfile: ICurrentUserProfileC | null = null;

  public isAuthenticated = new BehaviorSubject<boolean>(this._isAuthenticatedInit);

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
    console.log("running AuthService");
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      if (localStorage.getItem("currentAppUser")) {
        var currentUserLocal = localStorage.getItem("currentAppUser");
        this.currentUser = JSON.parse(currentUserLocal!);
        this.validateUserToServer(this.currentUser!);
        console.log("UserValidated");
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

  validateUserToServer(user: ICurrentUser) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    })

    let params = new HttpParams();

    if (user.email) {
      params = params.append('email', user.email);
    }

    if (user.token) {
      params = params.append('token', user.token);
    }

    let request = this.http.get<any>(this.baseUrl + "get-user",
      { headers: headers, params: params }).subscribe({
        next: (profile: ICurrentUserProfileC) => {
          this.isAuthenticated.next(true);
          this.currentUserProfile = profile;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error)
        }
      });
  }
}
