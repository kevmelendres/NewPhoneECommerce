import { Inject, Injectable, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { IRegisterModel } from '../Models/registermodel';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { ILoginModel } from '../Models/loginmodel';
import { ICurrentUser } from '../Models/currentuser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, catchError, concatMap, first, map, mergeMap, of, pipe, switchMap, take, tap} from 'rxjs';
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

  private isBrowser!: boolean;
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object) {
  }

  checkIfUserIsStoredInLocal(): Observable<boolean> {
    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage !== undefined) {
      if (localStorage.getItem("currentAppUser") !== null) {
        var currentUserLocal = localStorage.getItem("currentAppUser");
        this.currentUser = JSON.parse(currentUserLocal!);
        this.currentUserProfileBS.next(this.currentUserProfile);
        return of(true);
      };
      return of(false);
    }

    return of(false);
  }

  register(data: IRegisterModel) {
    return this.http.post<ICurrentUser>(this.baseUrl + "register", data);
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

    var initialization = of(false);

    if (isPlatformBrowser(this.platformId)) {
      initialization = this.checkIfUserIsStoredInLocal().pipe(
        take(1),
        concatMap(userExists => {
          return this.validateUserToServer(userExists).pipe(take(1))
        }),
        tap(data => {
          if (typeof data !== "boolean") {
            this.currentUserProfileBS.next(data);
          }
        }),
        concatMap((data) => typeof data !== "boolean" ? this.getCurrentUserRoles().pipe(take(1)) : of(false)),
        tap((data => {
          if (typeof data !== "boolean") {
            if (data.includes("User")) {
              this.isUser = true;
              this.isUserBS.next(true);
            }
            if (data.includes("Admin")) {
              this.isAdmin = true;
              this.isAdminBS.next(true);
            }
          }
        })),
        concatMap((data) => typeof data !== "boolean" ? of(true) : of(false))
      );
    }

    return initialization;
  }

}
