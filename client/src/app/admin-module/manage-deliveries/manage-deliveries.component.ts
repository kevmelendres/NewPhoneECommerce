import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { IOrderDetailed } from '../../../Models/orderdetailed';
import { AdminOrderService } from '../../../Services/admin-order.service';
import { FormatHelpersService } from '../../../Services/format-helpers.service';
import { NgbDateStruct, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-deliveries',
  templateUrl: './manage-deliveries.component.html',
  styleUrl: './manage-deliveries.component.scss'
})
export class ManageDeliveriesComponent implements OnInit {
  orderStatusLinkClicked: ElementRef;
  @ViewChild("allDeliveries", { static: true }) allDeliveries: ElementRef;

  ordersToShow: IOrderDetailed[] = [];
  itemsToShow: number = 10;
  pageNumber: number = 1;
  orderStatusSelected: string;

  selectedOrder: IOrderDetailed;
  selectedOrderNo: number;

  deliveryDateSelected: NgbDateStruct;
  date: { year: number; month: number };

  orderStatusList: string[];

  selectedOrderStatus: string;

  constructor(private renderer: Renderer2,
    private adminOrderService: AdminOrderService,
    private formatHelpers: FormatHelpersService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.orderStatusLinkClicked = this.allDeliveries.nativeElement;
    this.renderer.addClass(this.orderStatusLinkClicked, "status-link-active");
    this.getOrders();
    this.orderStatusList = this.formatHelpers.orderStatusList;

  }

  onStatusLinkClick(event: any) {
    if (this.orderStatusLinkClicked) {
      this.renderer.removeClass(this.orderStatusLinkClicked, "status-link-active")
    }

    this.orderStatusLinkClicked = event.target;
    this.renderer.addClass(this.orderStatusLinkClicked, "status-link-active")

    this.pageNumber = 1;
    this.orderStatusSelected = event.target.innerText;

    this.getOrders();
  }

  formatOrderStatus(orderStatus: string) {
    return this.formatHelpers.formatOrderStatus(orderStatus);
  }

  getOrders() {
    this.adminOrderService.getOrders(this.pageNumber, this.itemsToShow,
      this.orderStatusSelected).subscribe(data => {
        this.ordersToShow = data
      });
  }

  onOrderClick(order: IOrderDetailed, content: TemplateRef<any>, orderNo: number) {
    this.selectedOrder = order;
    this.selectedOrderNo = orderNo;
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.selectedOrderStatus = this.formatOrderStatus(order.orderStatus);

    this.deliveryDateSelected = this.formatHelpers.getDeliveryDateAsNgbDate(this.selectedOrder);
  }

  onUpdateClick() {
    console.log(this.deliveryDateSelected);
  }

  getDeliveryDate(order: IOrderDetailed) {
    return this.formatHelpers.getDeliveryDate(order);
  }

  getShippingAddress(order: IOrderDetailed) {
    return this.formatHelpers.getShippingAddress(order);
  }

  getSubtotalPerItem(price: number, qty: number): number {
    return this.formatHelpers.getSubtotalPerItem(price, qty);
  }

  getTotalIncludingShipping(order: IOrderDetailed): number {
    return this.formatHelpers.getTotalIncludingShipping(order);
  }

  onOrderStatusClick(orderStatus: string) {
    this.selectedOrderStatus = orderStatus;
  }

  onDateClick(event: any) {
    event.stopPropagation();
  }

  getDeliveryDateAsNgbDate(order: IOrderDetailed): NgbDateStruct {
    return this.formatHelpers.getDeliveryDateAsNgbDate(order);
  }

  renderDateWarning(a: NgbDateStruct, b: NgbDateStruct): boolean {
    return !this.formatHelpers.areNgbDateStructsSame(a, b);
  }

  convertNgbDateStructToString(dateNgb: NgbDateStruct) {
    return this.formatHelpers.convertNgbDateStructToString(dateNgb);
  }
}
