import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../Services/cart-service.service';
import { IProduct } from '../../../Models/product';

@Component({
  selector: 'app-current-cart',
  templateUrl: './current-cart.component.html',
  styleUrl: './current-cart.component.scss'
})
export class CurrentCartComponent implements OnInit{

  protected _itemsInCart = new Map<IProduct, number>();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.itemsInCart.subscribe(items => this._itemsInCart = items);
  }

  getTotalPerItem(product: IProduct, qty: number) {
    return this.cartService.getTotalPerItem(product, qty);
  }

  getTotalPriceInCart() {
    return this.cartService.getTotalPriceInCart();
  }

}
