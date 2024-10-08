import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  renderComponent: boolean;
  renderProductsFooter: boolean;

  constructor() {

  }

  onRouterOutletActivate(data: any) {
    this.toRenderHeaders(data.constructor.name);
    this.toRenderProductsFooter(data.constructor.name);
  }

  toRenderHeaders(componentLoaded: String) {
    this.renderComponent = !(componentLoaded == '_LoginComponent' ||
      componentLoaded == '_RegisterComponent' ||
      componentLoaded == '_AdminHomeComponent' ||
      componentLoaded == '_ManageDeliveriesComponent' ||
      componentLoaded == '_ManageProductsComponent' ||
      componentLoaded == '_ManageUsersComponent'
    )
  }

  toRenderProductsFooter(componentLoaded: String) {
    this.renderProductsFooter = !(componentLoaded == '_LoginComponent' ||
      componentLoaded == '_RegisterComponent' ||
      componentLoaded == '_ProfileComponent' ||
      componentLoaded == '_CurrentCartComponent' ||
      componentLoaded == '_CheckoutComponent' ||
      componentLoaded == '_MyOrdersComponent' ||
      componentLoaded == '_AdminHomeComponent' ||
      componentLoaded == '_ManageDeliveriesComponent' ||
      componentLoaded == '_ManageProductsComponent' ||
      componentLoaded == '_ManageUsersComponent' ||
      componentLoaded == '_PageNotAvailableComponent'
    )
  }


}
