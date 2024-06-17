import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlDev } from '../Environment/dev.env';
import { IProduct } from '../Models/product';
import { IAdminManageProductParams } from '../Models/AdminManageProductParams';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  baseUrl: string = baseUrlDev;

  constructor(private http: HttpClient) { }

  getAllProducts(productParams: IAdminManageProductParams) {
    let params = new HttpParams();

    if (productParams.SortBy) {
      params = params.append('sortBy', productParams.SortBy);
    }

    if (productParams.ItemsToShow) {
      params = params.append('itemsToShow', productParams.ItemsToShow);
    }

    if (productParams.PageNumber) {
      params = params.append('pageNumber', productParams.PageNumber);
    }

    if (productParams.SearchString) {
      params = params.append('searchString', productParams.SearchString);
    }

    if (productParams.Availability) {
      params = params.append('availability', productParams.Availability);
    }

    if (productParams.Brand) {
      params = params.append('brand', productParams.Brand);
    }

    if (productParams.Seller) {
      params = params.append('seller', productParams.Seller);
    }

    return this.http.get<IProduct[]>(this.baseUrl + '/Products',
      { observe: 'body', params: params })
  }

  getAllProductsCount(): Observable<number> {
    return this.http.get<number>(this.baseUrl + '/Products/GetAllProductsCount');
  }
}
