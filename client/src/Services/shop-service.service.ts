import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { IProduct } from '../Models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl: string = 'http://localhost:5064/api/';
  constructor(private http: HttpClient) { }

  getProducts(sortBy?: string, itemsToShow?: number, pageNumber?: number) {

    let params = new HttpParams();
    
    if (sortBy) {
      params = params.append('sortBy', sortBy);
    }

    if (itemsToShow) {
      params = params.append('itemsToShow', itemsToShow.toString());
    }

    if (pageNumber) {
      params = params.append('pageNumber', pageNumber.toString());
    }

    return this.http.get<IProduct[]>(this.baseUrl + 'Products',
      { observe: 'response', params: params })
      .pipe(map(response => { return response.body }));
  }

  getProductBrands() {
    return this.http.get<string[]>(this.baseUrl + 'Products/UniqueBrands');
  }

  getAllProductsCount() {
    return this.http.get<number>(this.baseUrl + 'Products/GetAllProductsCount');
  }
}
