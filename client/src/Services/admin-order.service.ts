import { Injectable } from '@angular/core';
import { IOrderDetailed } from '../Models/orderdetailed';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { baseUrlDev } from '../Environment/dev.env';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {

  private baseUrl: string = baseUrlDev + "/Admin";

  constructor(private http: HttpClient) { }

  getOrders(pageNumber: number, itemsToShow: number, orderStatus: string | null, adminToken: string): Observable<IOrderDetailed[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

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
      (this.baseUrl + "/GetOrders", { params: params, headers: headers })
  }

  getOrdersCount(orderStatus: string | null, adminToken: string): Observable<number> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });
    let params = new HttpParams();

    if (orderStatus != "All Deliveries") {
      if (orderStatus) {
        params = params.append('orderStatus', orderStatus);
      }
    }
    return this.http.get<number>
      (this.baseUrl + "/GetOrdersTotalCount", { params: params, headers: headers })
  }

  editOrderStatus(orderId: number, orderStatus: string, adminToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    });

    if (orderId && orderStatus) {

      let body = {
        orderId: orderId,
        orderStatus: orderStatus
      }
      return this.http.post<string>(this.baseUrl + "/Order/EditOrderStatus", body, {headers: headers});
    }

    return of(null);
  }
}

