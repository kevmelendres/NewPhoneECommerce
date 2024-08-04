import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { IOrderDetailed } from '../../../Models/orderdetailed';
import { AdminOrderService } from '../../../Services/admin-order.service';
import { FormatHelpersService } from '../../../Services/format-helpers.service';
import { NgbDateStruct, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../../Services/pagination';
import { AuthService } from '../../../Services/auth-service.service';

@Component({
  selector: 'app-manage-deliveries',
  templateUrl: './manage-deliveries.component.html',
  styleUrl: './manage-deliveries.component.scss'
})
export class ManageDeliveriesComponent implements OnInit {
  orderStatusLinkClicked: ElementRef;
  @ViewChild("allDeliveries", { static: true }) allDeliveries: ElementRef;
  @ViewChild("orderDetails", { static: true }) orderDetailsModal: ElementRef;

  ordersToShow: IOrderDetailed[] = [];

  orderStatusSelected: string | null = null;

  selectedOrder: IOrderDetailed;
  selectedOrderNo: number;

  deliveryDateSelected: NgbDateStruct;
  date: { year: number; month: number };

  orderStatusList: string[];

  selectedOrderStatus: string;

  pagination: Pagination = new Pagination();

  adminToken: string;

  constructor(private renderer: Renderer2,
    private adminOrderService: AdminOrderService,
    private formatHelpers: FormatHelpersService,
    private modalService: NgbModal,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.adminToken = this.authService.currentUser?.token!;
    this.pagination.itemsToShow = 20;

    this.orderStatusLinkClicked = this.allDeliveries.nativeElement;
    this.renderer.addClass(this.orderStatusLinkClicked, "status-link-active");
    this.getOrders();
    this.orderStatusList = this.formatHelpers.orderStatusList;


    this.adminOrderService.getOrdersCount("All Deliveries", this.adminToken).subscribe(data => {
      this.pagination.allItemsCount = data;
      this.pagination.maxPossiblePageNumber = Math.ceil(this.pagination.allItemsCount / this.pagination.itemsToShow);
      this.pagination.resetPaginationNumbering();
      this.pagination.resetPageNumbersBasedOnCurrentPage();
      this.pagination.enableDisableNextPageClick();
    });
  }

  onStatusLinkClick(event: any) {
    if (this.orderStatusLinkClicked) {
      this.renderer.removeClass(this.orderStatusLinkClicked, "status-link-active")
    }

    this.orderStatusLinkClicked = event.target;
    this.renderer.addClass(this.orderStatusLinkClicked, "status-link-active")

    this.pagination.pageNumber = 1;
    this.orderStatusSelected = event.target.innerText;

    if (this.orderStatusSelected == "All Deliveries") {
      this.orderStatusSelected = null;
    }

    this.adminOrderService.getOrdersCount(this.orderStatusSelected, this.adminToken).subscribe(data => {
      this.pagination.allItemsCount = data;
      this.pagination.maxPossiblePageNumber = Math.ceil(this.pagination.allItemsCount / this.pagination.itemsToShow);
      this.pagination.resetPaginationNumbering();
      this.pagination.resetPageNumbersBasedOnCurrentPage();
      this.pagination.enableDisableNextPageClick();
    });


    this.getOrders();
  }

  formatOrderStatus(orderStatus: string) {
    return this.formatHelpers.formatOrderStatus(orderStatus);
  }

  getOrders() {
    this.adminOrderService.getOrders(this.pagination.pageNumber, this.pagination.itemsToShow,
      this.orderStatusSelected, this.adminToken).subscribe(data => {
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

  onUpdateClick(selectedOrder: IOrderDetailed) {
    this.adminOrderService.editOrderStatus(selectedOrder.orderId,
      this.selectedOrderStatus, this.adminToken).subscribe(
      data => {
        if (data == "Success") {
          this.getOrders();
          this.modalService.dismissAll();
        }
      }
    )
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

  onPrevPaginationClick() {
    this.pagination.onPrevPaginationClick();
  }

  onPageNumberClick(pageNumber: number) {
    this.pagination.onPageNumberClick(pageNumber);
    this.getOrders();
  }

  onNextPaginationClick() {
    this.pagination.onNextPaginationClick();
  }
}
