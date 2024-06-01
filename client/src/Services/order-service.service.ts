import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDeliveryMethod } from '../Models/deliverymethod';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl: string = 'http://localhost:5064/api/Orders';

  constructor(private http: HttpClient) { }

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
}
