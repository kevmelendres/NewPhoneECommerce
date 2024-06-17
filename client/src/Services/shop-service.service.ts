import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { IProduct } from '../Models/product';
import { BehaviorSubject, Subject } from 'rxjs';
import { baseUrlDev } from '../Environment/dev.env';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl: string = baseUrlDev + "/";

  sortByInit: string = 'Price: Low-to-High'
  itemsToShowInit: number = 10;
  pageNumberInit: number = 1;
  searchStringInit: string = "";
  brandNameInit: string = "";
  availabilityInit: string = "All Products";
  selectedBrandInit: string = "All Brands";
  selectedSellerInit: string = "All Sellers";

  sortByGP: string;
  itemsToShowGP: number;
  pageNumberGP: number;
  searchStringGP: string;
  brandNameGP: string;

  selectedAvailabilityGP: string;
  selectedBrandGP: string;
  selectedSellerGP: string;

  public sortBy = new BehaviorSubject(this.sortByInit);
  public itemsToShow = new BehaviorSubject(this.itemsToShowInit);
  public pageNumber = new BehaviorSubject(this.pageNumberInit);
  public searchString = new BehaviorSubject(this.searchStringInit);

  public pageNoItemsToShow = new BehaviorSubject<number>(0);

  public selectedAvailability = new BehaviorSubject(this.availabilityInit);
  public selectedBrand = new BehaviorSubject(this.selectedBrandInit);
  public selectedSeller = new BehaviorSubject(this.selectedSellerInit);

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

  changePageNoItemsToShow(page: number) {
    this.pageNoItemsToShow.next(page);
  }

  changeSelectedAvailability(availability: string) {
    this.selectedAvailability.next(availability);
  }

  changeSelectedBrand(brand: string) {
    this.selectedBrand.next(brand);
  }

  changeSelectedSeller(seller: string) {
    this.selectedSeller.next(seller);
  }

  constructor(private http: HttpClient) {
    this.sortBy.subscribe(val => this.sortByGP = val);
    this.itemsToShow.subscribe(val => this.itemsToShowGP = val);
    this.pageNumber.subscribe(val => this.pageNumberGP = val);
    this.searchString.subscribe(val => this.searchStringGP = val);

    this.selectedAvailability.subscribe(val => this.selectedAvailabilityGP = val);
    this.selectedBrand.subscribe(val => this.selectedBrandGP = val);
    this.selectedSeller.subscribe(val => this.selectedSellerGP = val);
  }

  getAllProducts() {
    let params = new HttpParams();
    
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

    if (this.selectedAvailabilityGP) {
      params = params.append('availability', this.selectedAvailabilityGP);
    }

    if (this.selectedBrandGP) {
      params = params.append('brand', this.selectedBrandGP);
    }

    if (this.selectedSellerGP) {
      params = params.append('seller', this.selectedSellerGP);
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

  getProductsBySeller(seller: string) {

    let params = new HttpParams();

    if (this.sortByGP) {
      params = params.append('sortBy', this.sortByGP);
    }

    if (this.itemsToShowGP) {
      params = params.append('itemsToShow', this.itemsToShowGP.toString());
    }

    if (this.pageNumberGP) {
      params = params.append('pageNumber', this.pageNumberGP.toString());
    }

    if (seller) {
      params = params.append('seller', seller);
    }

    return this.http.get<IProduct[]>(this.baseUrl + 'Products/GetProductsBySeller',
      { observe: 'response', params: params })
      .pipe(map(response => { return response.body }));
  }
}
