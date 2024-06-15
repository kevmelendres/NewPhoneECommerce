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

  constructor(private renderer: Renderer2,
    private adminOrderService: AdminOrderService,
    private formatHelpers: FormatHelpersService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.orderStatusLinkClicked = this.allDeliveries.nativeElement;
    this.renderer.addClass(this.orderStatusLinkClicked, "status-link-active");
    this.getOrders();
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
  }

  onDeliveryDateSelect(event: any) {
    console.log(event.next)
  }
 
}
