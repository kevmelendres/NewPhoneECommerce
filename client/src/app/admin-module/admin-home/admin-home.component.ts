import { Component, OnInit } from '@angular/core';
import { AdminOrderService } from '../../../Services/admin-order.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})


export class AdminHomeComponent implements OnInit{
  loadDashboard: boolean = true;
  loadProducts: boolean = false;
  loadDeliveries: boolean = false;
  loadUsers: boolean = false;

  cardTotalOrderItems: number;
  cardTotalOrders: number;
  cardUnmanagedOrders: number;
  cardDeliveredOrders: number;

  constructor(private adminOrderService: AdminOrderService) { }

  ngOnInit(): void {
    this.refreshCardData();
  }

  async refreshCardData() {

    this.adminOrderService.getOrders(1, 0, "").subscribe(data => {
      this.cardTotalOrders = data.length;

      let totalOrderItems = 0;

      data.forEach(order => {
        totalOrderItems += order.orderItems.length
      });

      this.cardTotalOrderItems = totalOrderItems;
    });

    this.adminOrderService.getOrders(1, 0, "Delivered").subscribe(data => {
      this.cardDeliveredOrders = data.length;
    });

    this.adminOrderService.getOrders(1, 0, "Order Placed").subscribe(data => {
      this.cardUnmanagedOrders = data.length;
    });

  }
}
