import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdminOrderService } from '../../../Services/admin-order.service';
import { AuthService } from '../../../Services/auth-service.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

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

  adminToken: string;
  isAdmin: boolean = false;

  constructor(private adminOrderService: AdminOrderService,
    private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.authService.initializeComponentLogin().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.authService.isAdminBS.subscribe(isAdmin => {
          this.isAdmin = isAdmin;
          if (!this.isAdmin) {
            this.router.navigateByUrl("");
          }
          this.adminToken = this.authService.currentUser?.token!;
          this.refreshCardData();
        });
      } else {
        this.router.navigateByUrl("");
      }
    });
  }

  async refreshCardData() {
    if (this.adminToken) {
      this.adminOrderService.getOrders(1, 0, "", this.adminToken).pipe(take(1)).subscribe(data => {
        this.cardTotalOrders = data.length;

        let totalOrderItems = 0;

        data.forEach(order => {
          totalOrderItems += order.orderItems.length
        });

        this.cardTotalOrderItems = totalOrderItems;
      });

      this.adminOrderService.getOrders(1, 0, "Delivered", this.adminToken).pipe(take(1)).subscribe(data => {
        this.cardDeliveredOrders = data.length;
      });

      this.adminOrderService.getOrders(1, 0, "Order Placed", this.adminToken).pipe(take(1)).subscribe(data => {
        this.cardUnmanagedOrders = data.length;
      });
    }
  }
}
