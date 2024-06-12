import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {
  loadDashboard: boolean = true;
  loadProducts: boolean = false;
  loadDeliveries: boolean = false;
  loadUsers: boolean = false;


  loadComponent(event: any) {
    let componentToLoad: string = event.target.innerText;

    switch (componentToLoad) {
      case "Dashboard": {
        this.loadDashboard = true;

        this.loadProducts = false;
        this.loadDeliveries = false;
        this.loadUsers = false; 
        break;
      }

      case "Products": {
        this.loadProducts = true;

        this.loadDashboard = false;
        this.loadDeliveries = false;
        this.loadUsers = false;
        break;
      }

      case "Deliveries": {
        this.loadDeliveries = true;

        this.loadDashboard = false;
        this.loadProducts = false;
        this.loadUsers = false;
        break;
      }

      case "Users": {
        this.loadUsers = true;

        this.loadDashboard = false;
        this.loadProducts = false;
        this.loadDeliveries = false;
        break;
      }

      default: {
        this.loadDashboard = true;

        this.loadProducts = false;
        this.loadDeliveries = false;
        this.loadUsers = false;
        break;
      }
    } 
  }
}
