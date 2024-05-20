import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, ContentChild, DoCheck, ElementRef, Inject, KeyValueDiffer, KeyValueDiffers, NgZone, OnChanges, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild, contentChild } from '@angular/core';
import { CartService } from '../../Services/cart-service.service';
import { IProduct } from '../../Models/product';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
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
  itemsOnCart: Map<IProduct, number>;
  totalPriceInCart: number;
  isAuthenticated: boolean;
  currentUser: ICurrentUser | null;

  private _isAuthenticated: boolean;

  @ViewChild('signinDropdown', { static: false }) signinDropdown: ElementRef;

  constructor(private cartService: CartService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router, private renderer: Renderer2,
    private elem: ElementRef) {
  }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(data => this._isAuthenticated = data);

    this.currentUser = this.authService.getCurrentUser();
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

  viewCartClick() {
    console.log("View cart clicked");
  }

  changeProductQty(product: IProduct, qty: number, popOver: NgbPopover) {
    this.cartService.addToCart(product, qty);
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
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem("currentAppUser");
    this.router.navigate(["/home"]);
  }

  onCartClick(event: any) {
    event.stopPropagation();
  }
}
