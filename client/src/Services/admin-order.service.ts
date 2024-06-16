import { Injectable } from '@angular/core';
import { IOrderDetailed } from '../Models/orderdetailed';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { baseUrlDev } from '../Environment/dev.env';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {

  private baseUrl: string = baseUrlDev + "/Admin";

  constructor(private http: HttpClient) { }

  getOrders(pageNumber: number, itemsToShow: number, orderStatus: string | null): Observable<IOrderDetailed[]> {
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

    return this.http.get<IOrderDetailed[]>
      (this.baseUrl + "/GetOrders", { params: params })
  }

  editOrderStatus(orderId: number, orderStatus: string): Observable<any> {

    if (orderId && orderStatus) {

      let body = {
        orderId: orderId,
        orderStatus: orderStatus
      }
      console.log(body);
      return this.http.post<string>(this.baseUrl + "/Order/EditOrderStatus", body);
    }

    return of(null);
  }
}

