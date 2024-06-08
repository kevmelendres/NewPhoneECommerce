import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IDeliveryMethod } from '../../../Models/deliverymethod';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../../Services/order-service.service';
import { CartService } from '../../../Services/cart-service.service';
import { IProduct } from '../../../Models/product';
import { AuthService } from '../../../Services/auth-service.service';
import { ICurrentUserProfileC } from '../../../Models/currentuserprofile';
import { IOrder } from '../../../Models/order';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  notificationHeader: string;
  notificationMessage: string;
  @ViewChild('notification') public notification: TemplateRef<any>;

  protected _itemsInCart = new Map<IProduct, number>();

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
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.cartService.itemsInCart.subscribe(items => this._itemsInCart = items);

    this.authService.initialLoginUser().subscribe(isLoggedIn => {
      if (isLoggedIn) {
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
      } else {
        this.router.navigateByUrl("/login");
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

    this.orderService.createOrder(orderToSubmit, this._itemsInCart).subscribe(data => {
      if (typeof (data) == 'number') {
        this.notificationMessage = "Your order has been created. Redirecting you back to your orders.";
        this.notificationHeader = "Order creation success!"
      } else {
        this.notificationMessage = "Bad request";
        this.notificationHeader = "Order creation failed!"
      };

      this.runModalNotifServices();
    });
  }

  runModalNotifServices() {
    this.openModalNotif(this.notification);
    setTimeout(() => {
      this.closeModalNotif(this.notification);
      this.router.navigateByUrl("/home");
    }, 3000);
  }

  openModalNotif(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  closeModalNotif(content: TemplateRef<any>) {
    this.modalService.dismissAll(content);
  }
}
