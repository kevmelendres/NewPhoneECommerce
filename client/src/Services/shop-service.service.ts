import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { IProduct } from '../Models/product';
import { BehaviorSubject } from 'rxjs';
import { SellerProductListPair } from '../Models/keyvaluepair';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl: string = 'http://localhost:5064/api/';

  sortByInit: string = 'Price: Low-to-High'
  itemsToShowInit: number = 10;
  pageNumberInit: number = 1;
  searchStringInit: string = "";

  sortByGP: string;
  itemsToShowGP: number;
  pageNumberGP: number;
  searchStringGP: string;

  public sortBy = new BehaviorSubject(this.sortByInit);
  public itemsToShow = new BehaviorSubject(this.itemsToShowInit);
  public pageNumber = new BehaviorSubject(this.pageNumberInit);
  public searchString = new BehaviorSubject(this.searchStringInit);

  changeSortedItems(sortBy: string) {
    this.sortBy.next(sortBy);
  }

  changeItemsToShow(itemsToShow: number) {
    this.itemsToShow.next(itemsToShow);
  }

  changePageNumber(pageNumber: number) {
    this.pageNumber.next(pageNumber);
  }

  changeSearchString(searchString: string) {
    this.searchString.next(searchString);
  }

  constructor(private http: HttpClient) { }

  getProducts() {
    let params = new HttpParams();

    this.sortBy.subscribe(val => this.sortByGP = val);
    this.itemsToShow.subscribe(val => this.itemsToShowGP = val);
    this.pageNumber.subscribe(val => this.pageNumberGP = val);
    this.searchString.subscribe(val => this.searchStringGP = val);
    
    if (this.sortByGP) {
      params = params.append('sortBy', this.sortByGP);
    }

    if (this.itemsToShowGP) {
      params = params.append('itemsToShow', this.itemsToShowGP.toString());
    }

    if (this.pageNumberGP) {
      params = params.append('pageNumber', this.pageNumberGP.toString());
    }

    if (this.searchStringGP) {
      params = params.append('searchString', this.searchStringGP);
    }

    return this.http.get<IProduct[]>(this.baseUrl + 'Products',
      { observe: 'response', params: params })
      .pipe(map(response => { return response.body }));
  }

  getProductBrands(topItemsValue: number | undefined) {
    let params = new HttpParams();

    if (topItemsValue) {
      params = params.append('topValue', topItemsValue);
    }

    return this.http.get<string[]>(this.baseUrl + 'Products/UniqueBrands',
      { observe: 'response', params: params })
      .pipe(map(response => { return response.body }));
  }

  getProductSellers(topItemsValue: number | undefined) {
    let params = new HttpParams();

    if (topItemsValue) {
      params = params.append('topValue', topItemsValue);
    }

    return this.http.get<string[]>(this.baseUrl + 'Products/UniqueSellers',
      { observe: 'response', params: params })
      .pipe(map(response => { return response.body }));
  }

  getProductColors(topItemsValue: number | undefined) {
    let params = new HttpParams();

    if (topItemsValue) {
      params = params.append('topValue', topItemsValue);
    }

    return this.http.get<string[]>(this.baseUrl + 'Products/UniqueColors',
      { observe: 'response', params: params })
      .pipe(map(response => { return response.body }));
  }

  getAllProductsCount() {
    return this.http.get<number>(this.baseUrl + 'Products/GetAllProductsCount');
  }

  getAllProductsModels() {
    return this.http.get<string[]>(this.baseUrl + 'Products/GetAllProductsModels');
  }

  getDealsOfTheDay() {
    return this.http.get<IProduct[]>(this.baseUrl + 'Products/GetDealsOfTheDay');
  }

  getOnSaleProducts() {
    return this.http.get<IProduct[]>(this.baseUrl + 'Products/GetOnSaleProducts');
  }

  getBestSellerProducts() {
    return this.http.get<IProduct[]>(this.baseUrl + 'Products/GetBestSellerProducts');
  }

  getWhatsNewProducts() {
    return this.http.get<IProduct[]>(this.baseUrl + 'Products/GetWhatsNewProducts');
  }

  getRandomSellersAndProducts() {
    return this.http.get<string>(this.baseUrl + 'Products/GetRandomSellersAndProducts');
  }

  getProductByID(id: string | null) {
    return this.http.get<IProduct>(this.baseUrl + `Products/${id}`);
  }
}
