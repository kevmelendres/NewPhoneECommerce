import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { OrderService } from '../../../Services/order-service.service';
import { AuthService } from '../../../Services/auth-service.service';
import { ICurrentUser } from '../../../Models/currentuser';
import { IOrderDetailed } from '../../../Models/orderdetailed';
import { FormatHelpersService } from '../../../Services/format-helpers.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {

  monthNames: string[] = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  currentUser: ICurrentUser | null;
  buyerOrders: IOrderDetailed[];

  selectedOrder: IOrderDetailed;
  selectedRowId: number;

  @ViewChild("orderRows") orderRows: ElementRef;

  constructor(private orderService: OrderService,
    private authService: AuthService,
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>,
    private formatHelpers: FormatHelpersService) { };

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.orderService.getAllOrders(this.currentUser).subscribe(data => {
      this.buyerOrders = data;
    });
  }


  onOrderRowClick(order: IOrderDetailed, rowId: number) {

    if (this.selectedRowId != null) {
      this.renderer.removeClass(this.orderRows.nativeElement.children[this.selectedRowId], "table-active");
    }

    this.selectedOrder = order;
    this.selectedRowId = rowId;
    let selectedRow = this.orderRows.nativeElement.children[rowId];
    this.renderer.addClass(selectedRow, "table-active"); 

  }

  getRowId(index: number): string {
    return "order-no-" + index.toString();
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

  getShippingAddress(order: IOrderDetailed): string {
    return order.addressStreet + " / "
      + order.addressBarangay + " / "
      + order.addressMunicipality + " / "
      + order.addressProvince + " / "
      + order.addressRegion + " / "
      + order.addressCountry + " / "
      + "Zip Code: " + order.addressZipCode
  }

  convertOrderDateToObj(date: string): Date {
    return new Date(date);
  }

  formatOrderStatus(orderStatus: string): string {
    return this.formatHelpers.formatOrderStatus(orderStatus);
  }

  getMonthName(monthNum: number): string {
    return this.monthNames[monthNum];
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

  getDeliveryDate(orderCreatedDate: string, deliveryDays: number): string {
    let orderCreatedDateObj: Date = this.convertOrderDateToObj(orderCreatedDate);
    let dateWithDelivery: Date = this.addDays(orderCreatedDateObj, deliveryDays);

    let monthName: string = this.getMonthName(dateWithDelivery.getMonth());
    let date: number = dateWithDelivery.getDate();
    let year: number = dateWithDelivery.getFullYear();

    return monthName + " " + date + ", " + year;
  }
  
}
