import { Injectable } from '@angular/core';
import { IOrderDetailed } from '../Models/orderdetailed';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrlDev } from '../Environment/dev.env';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {

  private baseUrl: string = baseUrlDev;

  constructor(private http: HttpClient) { }

  getOrders(pageNumber: number, itemsToShow: number, orderStatus: string): Observable<IOrderDetailed[]> {
    let params = new HttpParams();

    if (pageNumber) {
      params = params.append('pageNumber', pageNumber);
    }
    if (itemsToShow) {
      params = params.append('itemsToShow', itemsToShow);
    }
    if (orderStatus) {
      params = params.append('orderStatus', orderStatus);
    }

    console.log(params);

    return this.http.get<IOrderDetailed[]>
      (this.baseUrl + "/Admin/GetOrders", { params: params })
  }
}

