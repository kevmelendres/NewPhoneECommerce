import { Injectable } from '@angular/core';
import { baseUrlDev } from '../Environment/dev.env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IAdminAppUser } from '../Models/adminappuser';
import { IAdminManageUsersParams } from '../Models/AdminManageUsersParams';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  baseUrl: string = baseUrlDev;
  
  constructor(private http: HttpClient) { }

  getUsers(pageNumber?: number, itemsToShow?: number, searchString?: string) {

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
      { observe: 'body', params: params });
  }

}
