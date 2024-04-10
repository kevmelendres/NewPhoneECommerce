import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { IProduct } from '../Models/product';

@Injectable({
  providedIn: 'root'
})
export class SimilarItemsService {

  baseUrl: string = 'http://localhost:5064/api/';

  sortByInit: string = 'Rating'
  itemsToShowInit: number = 5;
  pageNumberInit: number = 1;
  brandNameInit: string = "";

  sortByGP: string;
  itemsToShowGP: number;
  pageNumberGP: number;
  brandNameGP: string;

  public sortBy = new BehaviorSubject(this.sortByInit);
  public itemsToShow = new BehaviorSubject(this.itemsToShowInit);
  public pageNumber = new BehaviorSubject(this.pageNumberInit);
  public brandName = new BehaviorSubject(this.brandNameInit);

  constructor(private http: HttpClient) { }

  changeSortedItems(sortBy: string) {
    this.sortBy.next(sortBy);
  }

  changeItemsToShow(itemsToShow: number) {
    this.itemsToShow.next(itemsToShow);
  }

  changePageNumber(pageNumber: number) {
    this.pageNumber.next(pageNumber);
  }

  changeBrandName(brandName: string) {
    this.brandName.next(brandName);
  }

  getSimilarProducts() {
    let params = new HttpParams();

    this.sortBy.subscribe(val => this.sortByGP = val);
    this.itemsToShow.subscribe(val => this.itemsToShowGP = val);
    this.pageNumber.subscribe(val => this.pageNumberGP = val);
    this.brandName.subscribe(val => this.brandNameGP = val);

    if (this.sortByGP) {
      params = params.append('sortBy', this.sortByGP);
    }

    if (this.itemsToShowGP) {
      params = params.append('itemsToShow', this.itemsToShowGP.toString());
    }

    if (this.pageNumberGP) {
      params = params.append('pageNumber', this.pageNumberGP.toString());
    }

    if (this.brandNameGP) {
      params = params.append('brandName', this.brandNameGP);
    }

    return this.http.get<IProduct[]>(this.baseUrl + 'Products/GetProductsByBrand',
      { observe: 'response', params: params })
      .pipe(map(response => { return response.body }));
  }
}
