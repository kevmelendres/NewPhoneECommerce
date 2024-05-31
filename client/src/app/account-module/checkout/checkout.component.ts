import { Component } from '@angular/core';
import { IDeliveryMethod } from '../../../Models/deliverymethod';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  deliveryMethodName: string;
  deliveryMethodDays: number;
  deliveryMethodDescription: string;
  deliveryMethodPrice: number;

  deliveryMethodForm: IDeliveryMethod;

  constructor(private http: HttpClient) { }


  testClick() {
    this.deliveryMethodForm = {
      Name: this.deliveryMethodName,
      DeliveryDays: this.deliveryMethodDays,
      Description: this.deliveryMethodDescription,
      Price: this.deliveryMethodPrice,
    }

    this.http.post()
  }
}
