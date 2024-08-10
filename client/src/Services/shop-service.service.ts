import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { IProduct } from '../Models/product';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private baseUrl = environment.API_URL + "/";

  searchBarToggle: boolean = true;
  returnToPageOneVal: boolean = true;

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

  public totalProductCountGP: number = 0;
  public totalProductCount = new BehaviorSubject(this.totalProductCountGP);

  public returnToPageOneSwitch = new BehaviorSubject(this.returnToPageOneVal);

  changeSortedItems(sortBy: string) {
    this.sortBy.next(sortBy);
  }

  changeItemsToShow(itemsToShow: number) {
    this.itemsToShow.next(itemsToShow);
  }

  changePageNumber(pageNumber: number) {
    this.pageNumber.next(pageNumber);
  }

  returnToPageOne() {
    this.returnToPageOneSwitch.next(this.returnToPageOneVal);
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
    let paramsTotalCount: HttpParams = new HttpParams();

    if (this.sortByGP) {
      params = params.append('sortBy', this.sortByGP);
      paramsTotalCount = paramsTotalCount.append('sortBy', this.sortByGP);
    }

    if (this.itemsToShowGP) {
      params = params.append('itemsToShow', this.itemsToShowGP.toString());
      paramsTotalCount = paramsTotalCount.append('itemsToShow', "0");
    }

    if (this.pageNumberGP) {
      params = params.append('pageNumber', this.pageNumberGP.toString());
      paramsTotalCount = paramsTotalCount.append('pageNumber', this.pageNumberGP.toString());
    }

    if (this.searchStringGP) {
      params = params.append('searchString', this.searchStringGP);
      paramsTotalCount = paramsTotalCount.append('searchString', this.searchStringGP);
    }

    if (this.selectedAvailabilityGP) {
      params = params.append('availability', this.selectedAvailabilityGP);
      paramsTotalCount = paramsTotalCount.append('availability', this.selectedAvailabilityGP);
    }

    if (this.selectedBrandGP) {
      params = params.append('brand', this.selectedBrandGP);
      paramsTotalCount = paramsTotalCount.append('brand', this.selectedBrandGP);
    }

    if (this.selectedSellerGP) {
      params = params.append('seller', this.selectedSellerGP);
      paramsTotalCount = paramsTotalCount.append('seller', this.selectedSellerGP);
    }

    this.http.get<IProduct[]>(this.baseUrl + 'Products',
      { observe: 'body', params: paramsTotalCount }).subscribe(data => {
        this.totalProductCount.next(data.length);
      });

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
