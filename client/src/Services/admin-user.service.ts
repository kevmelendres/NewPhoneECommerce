import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IAdminAppUser } from '../Models/adminappuser';
import { IAdminManageUsersParams } from '../Models/adminmanageusersparams';
import { Observable } from 'rxjs';
import { IEditUserByAdmin } from '../Models/edituserbyadmin';
import { json } from 'node:stream/consumers';
import { IDeleteUserByAdmin } from '../Models/deleteuserbyadmin';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private baseUrl = environment.API_URL;
  constructor(private http: HttpClient) { }

  getUsers(adminToken: string, pageNumber?: number, itemsToShow?: number, searchString?: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    let userParams: IAdminManageUsersParams = {
      PageNumber: pageNumber,
      ItemsToShow: itemsToShow,
      SearchString: searchString
    };

    let params = new HttpParams();

    if (userParams?.ItemsToShow) {
      params = params.append('itemsToShow', userParams.ItemsToShow);
    }

    if (userParams?.PageNumber) {
      params = params.append('pageNumber', userParams.PageNumber);
    }

    if (userParams?.SearchString) {
      params = params.append('searchString', userParams.SearchString);
    }

    return this.http.get<IAdminAppUser[]>(this.baseUrl + '/Identity/get-allUsers',
      { observe: 'body', params: params, headers: headers});
  }

  editUser(userToEdit: IEditUserByAdmin, adminToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    return this.http.post<any>(this.baseUrl + '/Identity/edit-user-admin',
      userToEdit, { headers: headers });
  }

  createNewUser(userToAdd: IEditUserByAdmin, adminToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    return this.http.post<any>(this.baseUrl + '/Identity/add-user-admin',
      userToAdd, { headers: headers });
  }

  deleteUser(userEmail: string, adminToken: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    return this.http.post<any>(this.baseUrl + '/Identity/delete-user',
      JSON.stringify(userEmail), { headers: headers});
  }

  searchUsers(searchUser: string, adminToken: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    let params = new HttpParams();

    params = params.append('searchString', searchUser);

    return this.http.get<IAdminAppUser[]>(this.baseUrl + '/Identity/search-user',
      { observe: 'body', params: params, headers: headers});
  }
}
