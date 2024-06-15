import { Injectable } from '@angular/core';
import { IOrderDetailed } from '../Models/orderdetailed';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IOrder } from '../Models/order';

@Injectable({
  providedIn: 'root'
})
export class FormatHelpersService {

  monthNames: string[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  orderStatusList: string[] = [
    "Delivered",
    "Order In Progress",
    "Preparing To Ship",
    "Shipped",
    "Order Placed"
  ]


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

  getDeliveryDate(order: IOrderDetailed): string {

    const orderCreatedDate = order.orderDate;
    const deliveryDays = order.deliveryMethodDays;

    let orderCreatedDateObj: Date = this.convertOrderDateToObj(orderCreatedDate);
    let dateWithDelivery: Date = this.addDays(orderCreatedDateObj, deliveryDays);

    let monthName: string = this.getMonthName(dateWithDelivery.getMonth());
    let date: number = dateWithDelivery.getDate();
    let year: number = dateWithDelivery.getFullYear();

    return monthName + " " + date + ", " + year;
  }



  getConvertedDateToString(dateString: string): string {
    let dateObj: Date = this.convertOrderDateToObj(dateString);

    let monthName: string = this.getMonthName(dateObj.getMonth());
    let date: number = dateObj.getDate();
    let year: number = dateObj.getFullYear();

    return monthName + " " + date + ", " + year;
  }

  addDays(dateOrig: Date, addDays: number): Date {
    var date = new Date(dateOrig.valueOf());
    date.setDate(date.getDate() + addDays);
    return date;
  }

  convertOrderDateToObj(date: string): Date {
    return new Date(date);
  }

  getMonthName(monthNum: number): string {
    return this.monthNames[monthNum];
  }

  getShippingAddress(order: IOrderDetailed): string {
    return order.addressStreet + " / "
      + order.addressBarangay + " / "
      + order.addressMunicipality + " / "
      + order.addressProvince + " / "
      + order.addressRegion + " / "
      + order.addressCountry + " / "
      + "Zip Code: " + order.addressZipCode
  }

  getSubtotalPerItem(price: number, qty: number): number {
    return price * qty;
  }

  getTotalIncludingShipping(order: IOrderDetailed): number {
    let totalOrderFee: number = 0;

    order.orderItems.forEach(item => {
      totalOrderFee += (this.getSubtotalPerItem(item.discountedPrice, item.quantity))
    });

    totalOrderFee += order.deliveryMethodPrice;
    return totalOrderFee;
  }

  convertNgbDateToJSDate(date: NgbDateStruct) {
    return new Date(date.year, date.month - 1, date.day)
  }

  convertOrderDateToNgbDate(dateJSObj: Date) {

    const dateNgbStruct: NgbDateStruct = {
      year: dateJSObj.getFullYear(),
      day: dateJSObj.getDate(),
      month: dateJSObj.getMonth() + 1,
    }

    return dateNgbStruct;
  }

  getDeliveryDateAsNgbDate(order: IOrderDetailed): NgbDateStruct {

    const orderCreatedDate = order.orderDate;
    const deliveryDays = order.deliveryMethodDays;

    let orderCreatedDateObj: Date = this.convertOrderDateToObj(orderCreatedDate);
    let dateWithDelivery: Date = this.addDays(orderCreatedDateObj, deliveryDays);

    return this.convertOrderDateToNgbDate(dateWithDelivery);
  }

  areNgbDateStructsSame(a: NgbDateStruct, b: NgbDateStruct): boolean {
    return (a.day == b.day && a.month == b.month && a.year == b.year)
  }

  convertNgbDateStructToString(dateNgb: NgbDateStruct) {
    let monthName: string = this.getMonthName(dateNgb.month - 1);
    let date: number = dateNgb.day;
    let year: number = dateNgb.year;

    return monthName + " " + date + ", " + year;

  }
}
