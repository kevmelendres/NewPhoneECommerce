import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { IProduct } from '../Models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl: string = 'http://localhost:5064/api/';

  sortByInit: string = 'Price: Low-to-High'
  itemsToShowInit: number = 10;
  pageNumberInit: number = 1;

  sortByGP: string;
  itemsToShowGP: number;
  pageNumberGP: number;

  public sortBy = new BehaviorSubject(this.sortByInit);
  public itemsToShow = new BehaviorSubject(this.itemsToShowInit);
  public pageNumber = new BehaviorSubject(this.pageNumberInit);

  changeSortedItems(sortBy: string) {
    this.sortBy.next(sortBy);
  }

  changeItemsToShow(itemsToShow: number) {
    this.itemsToShow.next(itemsToShow);
  }

  changePageNumber(pageNumber: number) {
    this.pageNumber.next(pageNumber);
  }

  constructor(private http: HttpClient) { }

  getProducts() {
    let params = new HttpParams();

    this.sortBy.subscribe(val => this.sortByGP = val);
    this.itemsToShow.subscribe(val => this.itemsToShowGP = val);
    this.pageNumber.subscribe(val => this.pageNumberGP = val);
    
    if (this.sortByGP) {
      params = params.append('sortBy', this.sortByGP);
    }

    if (this.itemsToShowGP) {
      params = params.append('itemsToShow', this.itemsToShowGP.toString());
    }

    if (this.pageNumberGP) {
      params = params.append('pageNumber', this.pageNumberGP.toString());
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
