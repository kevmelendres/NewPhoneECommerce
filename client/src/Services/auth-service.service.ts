import { Inject, Injectable } from '@angular/core';
import { IRegisterModel } from '../Models/registermodel';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { ILoginModel } from '../Models/loginmodel';
import { ICurrentUser } from '../Models/currentuser';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, catchError, first, map, mergeMap, of, switchMap } from 'rxjs';
import { ICurrentUserProfileC } from '../Models/currentuserprofile';
import { subscribe } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = 'http://localhost:5064/api/Identity/';
  private _isAuthenticatedInit: boolean = false;
  public currentUser: ICurrentUser | null = null;
  private currentUserProfile: ICurrentUserProfileC | null = null;

  public isAuthenticated = new BehaviorSubject<boolean>(this._isAuthenticatedInit);
  public currentUserProfileBS = new BehaviorSubject<ICurrentUserProfileC | null>(this.currentUserProfile);

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
    this.initialLoginUser().subscribe();
  }

  initialLoginUser(): Observable<boolean> {
    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage) {
      if (localStorage.getItem("currentAppUser")) {
        var currentUserLocal = localStorage.getItem("currentAppUser");
        this.currentUser = JSON.parse(currentUserLocal!);
        return this.validateUserToServer(this.currentUser!);
      };
    }

    return of(false);
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
            this.validateUserToServer(this.currentUser).subscribe();
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

  validateUserToServer(user: ICurrentUser): Observable<boolean> {
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
      { headers: headers, params: params })
      .pipe(
        first(),
        catchError(error => of(false)),
        map(data => {
          if (data !== false){
            this.isAuthenticated.next(true);
            this.currentUserProfile = data;
            this.currentUserProfileBS.next(data);
            return true;
          }
          return false;
        }));

    return request;

  }

  updateUserDetails(updatedUser: ICurrentUserProfileC) {
    if (this.currentUser) {
      this.currentUser.displayName = updatedUser.DisplayName!;
    }

    if (this.currentUserProfile) {
      this.currentUserProfile = updatedUser;
      this.currentUserProfileBS.next(this.currentUserProfile);
    }
  }
}
