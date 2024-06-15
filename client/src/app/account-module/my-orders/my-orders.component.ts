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
    return this.formatHelpers.getSubtotalPerItem(price, qty);
  }

  getTotalIncludingShipping(order: IOrderDetailed): number {
    return this.formatHelpers.getTotalIncludingShipping(order);
  }

  getShippingAddress(order: IOrderDetailed): string {
    return this.formatHelpers.getShippingAddress(order);
  }

  formatOrderStatus(orderStatus: string): string {
    return this.formatHelpers.formatOrderStatus(orderStatus);
  }

  getDeliveryDate(order: IOrderDetailed): string {
    return this.formatHelpers.getDeliveryDate(order);
  }
  
}
