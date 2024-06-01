import { Component } from '@angular/core';
import { IDeliveryMethod } from '../../../Models/deliverymethod';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../../Services/order-service.service';

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

  constructor(private http: HttpClient, private orderService: OrderService) { }


  testClick() {
    this.deliveryMethodForm = {
      name: this.deliveryMethodName,
      deliveryDays: this.deliveryMethodDays,
      description: this.deliveryMethodDescription,
      price: this.deliveryMethodPrice,
    }

    this.orderService.addDeliveryMethod(this.deliveryMethodForm);
  }
}
