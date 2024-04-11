import { Component, ElementRef, NgZone, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { CartService } from '../../Services/cart-service.service';
import { IProduct } from '../../Models/product';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  itemsOnCart: Map<IProduct, number>;
  totalPriceInCart: number;
  constructor(private cartService: CartService) {
    
  }

  ngOnInit(): void {
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
  
}
