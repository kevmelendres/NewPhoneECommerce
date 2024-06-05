import { Component, OnInit } from '@angular/core';
import { IDeliveryMethod } from '../../../Models/deliverymethod';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../../Services/order-service.service';
import { CartService } from '../../../Services/cart-service.service';
import { IProduct } from '../../../Models/product';
import { AuthService } from '../../../Services/auth-service.service';
import { ICurrentUserProfileC } from '../../../Models/currentuserprofile';
import { IOrder } from '../../../Models/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  deliveryMethodName: string;
  deliveryMethodDays: number;
  deliveryMethodDescription: string;
  deliveryMethodPrice: number;

  deliveryMethodForm: IDeliveryMethod;

  protected itemsInCart: Map<IProduct, number>;

  lastName: string;
  countryAddress: string;
  regionAddress: string;
  provinceAddress: string;
  municipalityAddress: string;
  barangayAddress: string;
  zipCodeAddress: number | undefined;
  streetAddress: string;

  currentUserProfile: ICurrentUserProfileC | null;
  allDeliveryMethods: IDeliveryMethod[] | null;

  selectedDeliveryMethod: IDeliveryMethod;

  constructor(private http: HttpClient,
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.cartService.itemsInCart.subscribe(data => this.itemsInCart = data);
    this.authService.currentUserProfileBS.subscribe(data => {
      this.currentUserProfile = data;
    });

    this.orderService.allDeliveryMethodsBS.subscribe(data => {
      this.allDeliveryMethods = data;
      if (this.allDeliveryMethods) {
        this.selectedDeliveryMethod = this.allDeliveryMethods[0];
      }
    });
  }

  testClick() {
    this.deliveryMethodForm = {
      name: this.deliveryMethodName,
      deliveryDays: this.deliveryMethodDays,
      description: this.deliveryMethodDescription,
      price: this.deliveryMethodPrice,
    }

    this.orderService.addDeliveryMethod(this.deliveryMethodForm);
  }

  getSubtotalPerItem(product: IProduct, qty: number): number {
    return this.cartService.getTotalPerItem(product, qty);
  }

  getTotalIncludingShipping(): number {
    return this.cartService.getTotalPriceInCart() + this.selectedDeliveryMethod.price;
  }

  onOrderSubmit() {
    const orderToSubmit: IOrder = {
      buyerEmail: this.currentUserProfile!.Email,
      firstName: this.currentUserProfile!.FirstName,
      lastName: this.currentUserProfile!.LastName,
      addressCountry: "Philippines",

      addressRegion: this.currentUserProfile!.Region,
      addressProvince: this.currentUserProfile!.Province,
      addressMunicipality: this.currentUserProfile!.Municipality,
      addressBarangay: this.currentUserProfile!.Barangay,
      addressZipCode: this.currentUserProfile?.Zipcode,
      addressStreet: this.currentUserProfile!.Street,

      deliveryMethodId: this.selectedDeliveryMethod.id!,
      subtotal: this.getTotalIncludingShipping()
    };

    this.orderService.createOrder(orderToSubmit).subscribe(data => {
      if (typeof (data) == 'number') {
        // Show success modal
        // Redirect to My Orders
      };
    });
  }
}
