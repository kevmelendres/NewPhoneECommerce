import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlDev } from '../Environment/dev.env';
import { IProduct } from '../Models/product';
import { IAdminManageProductParams } from '../Models/AdminManageProductParams';
import { Observable, of } from 'rxjs';
import { IEditProduct } from '../Models/editproduct';
import { ISeller } from '../Models/seller';
import { IPreviousOwner } from '../Models/previousowner';
import { IAddNewProduct } from '../Models/addnewproduct';

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

  editProduct(editedProduct: IEditProduct, adminToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    let body = editedProduct
    return this.http.post<string>(this.baseUrl + "/Products/Edit", body, {headers: headers});
  }

  getCountWithSearchString(searchString: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('searchString', searchString);
    return this.http.get<number>(this.baseUrl + '/Products/GetProductCountWithSearchString',
      { observe: 'body', params: params });
  }

  getAllSellers(): Observable<ISeller[]> {
    return this.http.get<ISeller[]>(this.baseUrl + '/Products/GetAllSellers')
  }

  getAllPreviousOwners(): Observable<IPreviousOwner[]> {
    return this.http.get<IPreviousOwner[]>(this.baseUrl + '/Products/GetAllPreviousOwners')
  }

  addNewProduct(newProduct: IAddNewProduct, adminToken: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    return this.http.post<string>(this.baseUrl + '/Products/Add', newProduct, { headers: headers })
  }

  deleteProduct(productId: number, adminToken: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    return this.http.post<string>(this.baseUrl + '/Products/Delete', productId, { headers: headers });
  }
}
