import { Inject, Injectable } from '@angular/core';
import { IRegisterModel } from '../Models/registermodel';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { ILoginModel } from '../Models/loginmodel';
import { ICurrentUser } from '../Models/currentuser';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable, catchError, concatMap, first, map, mergeMap, of, pipe, switchMap, take } from 'rxjs';
import { ICurrentUserProfileC } from '../Models/currentuserprofile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = 'http://localhost:5064/api/Identity/';
  private _isAuthenticatedInit: boolean = false;
  public currentUser: ICurrentUser | null = null;
  private currentUserProfile: ICurrentUserProfileC | null = null;
  private currentUserRoles: string[] = [];

  public isAdmin: boolean = false;
  public isUser: boolean = false;

  public isAuthenticated = new BehaviorSubject<boolean>(this._isAuthenticatedInit);
  public currentUserProfileBS = new BehaviorSubject<ICurrentUserProfileC | null>(this.currentUserProfile);
  public isAdminBS = new BehaviorSubject<boolean>(this.isAdmin);
  public isUserBS = new BehaviorSubject<boolean>(this.isUser);

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
  }

  checkIfUserIsStoredInLocal(): Observable<boolean> {
    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage) {
      if (localStorage.getItem("currentAppUser")) {
        var currentUserLocal = localStorage.getItem("currentAppUser");
        this.currentUser = JSON.parse(currentUserLocal!);
        this.currentUserProfileBS.next(this.currentUserProfile);
        return of(true);
      };
    }

    return of(false);
  }

  register(data: IRegisterModel) {
    this.http.post<ICurrentUser>(this.baseUrl + "register", data).subscribe(
      response => console.log("registration success"));
  }

  loginUser(loginData: ILoginModel): Observable<boolean> {

    var response: Observable<boolean> =
      this.http.post<ICurrentUser>(this.baseUrl + "login", loginData).pipe(
        first(),
        catchError(error => of(null)),
        map(currentUserData => {
          if (currentUserData != null) {
            this.currentUser = currentUserData;
            localStorage.setItem("currentAppUser", JSON.stringify(this.currentUser));

            if (this.currentUser) {
              this.validateUserToServer(true).subscribe();
            }
            return true;
          }
          return false;
        }));

    return response;
  }


  logout(): void {
    localStorage.removeItem("currentAppUser");
    this.isAuthenticated.next(false);
    this.isAdminBS.next(false);
    this.isUserBS.next(false);
  }

  getCurrentUser(): ICurrentUser | null {
    return this.currentUser;
  }

  validateUserToServer(userExists: boolean): Observable<boolean> {
    if (userExists) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.currentUser!.token}`
      })

      let params = new HttpParams();

      if (this.currentUser!.email) {
        params = params.append('email', this.currentUser!.email);
      }

      if (this.currentUser!.token) {
        params = params.append('token', this.currentUser!.token);
      }

      return this.http.get<any>(this.baseUrl + "get-user",
        { headers: headers, params: params })
    }

    this.currentUser = null;
    return of(false)
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
  
  getCurrentUserRoles() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.currentUser?.token}`
    })
    let params = new HttpParams();
    params = params.append('email', this.currentUser!.email);

    return this.http.get<string[]>(this.baseUrl + "get-user-roles",
      { headers: headers, params: params })
  }

  initializeComponentLogin(): Observable<boolean> {
    var initialization: Observable<any> = this.checkIfUserIsStoredInLocal().pipe(
      take(1),
      concatMap(userExists => this.validateUserToServer(userExists)),
    );

    var validation = initialization.pipe(
      take(1),
      map(data => {
        if (typeof data !== "boolean") {
          this.currentUserProfileBS.next(data);
          this.getCurrentUserRoles().pipe(take(1)).subscribe(userRoles => {
            if (userRoles.includes("User")) {
              this.isUser = true;
              this.isUserBS.next(true);
            }
            if (userRoles.includes("Admin")) {
              this.isAdmin = true;
              this.isAdminBS.next(true);
            }
          });
          return true;
        }
        return false;
      })
    )

    return validation;
  }

}
