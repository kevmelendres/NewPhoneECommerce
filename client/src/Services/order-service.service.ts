import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDeliveryMethod } from '../Models/deliverymethod';
import { BehaviorSubject, of } from 'rxjs';
import { IOrder } from '../Models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl: string = 'http://localhost:5064/api/Orders';
  allDeliveryMethods: IDeliveryMethod[] | null = null;
  allDeliveryMethodsBS = new BehaviorSubject<IDeliveryMethod[] | null>(this.allDeliveryMethods);

  constructor(private http: HttpClient) {
    this.getAllDeliveryMethods();
  }

  addDeliveryMethod(deliveryMethod: IDeliveryMethod) {
    this.http.post(this.baseUrl + "/DeliveryMethod/Add", deliveryMethod)
      .subscribe({
        next: (data) => {
          console.log(data);
          },
        error: error => { console.log(error) }
      }
    )
  }

  getAllDeliveryMethods() {
    this.http.get<IDeliveryMethod[] | null>(this.baseUrl + "/DeliveryMethod/GetAllItems")
      .subscribe(data => this.allDeliveryMethodsBS.next(data));
  }

  createOrder(order: IOrder) {
    console.log(order);
    this.http.post<number>(this.baseUrl + "/Order/Create", order).subscribe(data => {
      if (data != -1) {
        
      };
    });
  }




}
