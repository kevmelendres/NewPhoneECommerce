import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, ContentChild, DoCheck, ElementRef, Inject, KeyValueDiffer, KeyValueDiffers, NgZone, OnChanges, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild, contentChild } from '@angular/core';
import { CartService } from '../../Services/cart-service.service';
import { IProduct } from '../../Models/product';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../Services/auth-service.service';
import { ICurrentUser } from '../../Models/currentuser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  notificationHeader: string;
  notificationMessage: string;

  itemsOnCart: Map<IProduct, number>;
  totalPriceInCart: number;
  currentUser: ICurrentUser | null;

  _isAuthenticated: boolean = false;

  @ViewChild('signinDropdown', { static: false }) signinDropdown: ElementRef;
  @ViewChild('dropDownMenu', { static: false }) dropDownMenu: ElementRef;
  @ViewChild('notification') public notification: TemplateRef<any>;

  constructor(private cartService: CartService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router, private renderer: Renderer2,
    private elem: ElementRef,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.authService.initializeComponentLogin().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.currentUser = this.authService.getCurrentUser();
      }
    })

    this.cartService.itemsInCart.subscribe(data => {
      this.itemsOnCart = data;
    });

    this.cartService.totalPriceInCart.subscribe(data => this.totalPriceInCart = data);
  }

  getTotalPerItem(product: IProduct, qty: number) {
    return this.cartService.getTotalPerItem(product, qty);
  }

  getTotalPriceInCart(): number {
    return this.cartService.getTotalPriceInCart();
  }

  changeProductQty(product: IProduct, qty: number ) {
    this.cartService.addToCart(product, qty);

    if (this.cartService.getQuantityOfProduct(product) == 0) {
      this.cartService.deleteProduct(product);
    }

  } 

  disablePopover(product: IProduct, popOver: NgbPopover) {
    if (this.cartService.getQuantityOfProduct(product) == 0) {
      popOver.open();
    } else {
      popOver.close();
    }
  }

  deleteProduct(product: IProduct, event: any) {
    this.cartService.deleteProduct(product);
    event.stopPropagation();
  }

  onLogoutClick() {
    const dropdown = this.signinDropdown.nativeElement;
    this.renderer.removeClass(dropdown,"show");
    this.currentUser = null;
    localStorage.removeItem("currentAppUser");
    this.authService.logout();

    this.notificationHeader = "Logout Success";
    this.notificationMessage = "Logging out successful. Redirecting you back to homepage."
    this.runModalNotifServices();
  }

  onCartClick(event: any) {
    event.stopPropagation();
  }

  onProfileClick() {
    this.router.navigate(["/account/profile"]);
    const dropdown = this.signinDropdown.nativeElement;
    this.renderer.removeClass(dropdown, "show");
  }

  openModalNotif(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  closeModalNotif(content: TemplateRef<any>) {
    this.modalService.dismissAll(content);
  }

  runModalNotifServices() {
    this.openModalNotif(this.notification);
    setTimeout(() => {
      this.closeModalNotif(this.notification);
      this.router.navigateByUrl("/home");
    }, 2000);
  }

  onViewCartClick() {
    this.router.navigate(["/account/my-cart"]);
    const dropdown = this.dropDownMenu.nativeElement;
    this.renderer.removeClass(dropdown, "show");
  }

  onCheckoutClick() {

    if (!this.currentUser) {
      this.router.navigate(["/account/login"]);
    } else {
      this.router.navigate(["/account/checkout"]);
    }

    const dropdown = this.dropDownMenu.nativeElement;
    this.renderer.removeClass(dropdown, "show");
  }

  onMyOrdersClick() {
    if (!this.currentUser) {
      this.router.navigate(["/account/login"]);
    } else {
      this.router.navigate(["/account/my-orders"]);
    }

    const dropdown = this.signinDropdown.nativeElement;
    this.renderer.removeClass(dropdown, "show");
  }
}
