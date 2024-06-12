import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatHelpersService {

  constructor() { }

  formatOrderStatus(orderStatus: string): string {
    let orderStatusFormatted: string;

    switch (orderStatus) {
      case "Delivered": {
        orderStatusFormatted = "Delivered";
        break;
      }
      case "OrderInProgress": {
        orderStatusFormatted = "Order In Progress";
        break;
      }
      case "PreparingToShip": {
        orderStatusFormatted = "Preparing To Ship";
        break;
      }
      case "Shipped": {
        orderStatusFormatted = "Shipped";
        break;
      }
      default: {
        orderStatusFormatted = "Order Placed";
        break;
      }
    }

    return orderStatusFormatted;
  }
}
