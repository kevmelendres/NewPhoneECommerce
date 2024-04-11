import { EventEmitter, Injectable, Output } from '@angular/core';
import { IProduct } from '../Models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  _itemsInCart = new Map<IProduct, number>();
  totalPriceInCartInit: number = 0;

  private totalPriceInCartGP: number = 0;

  public itemsInCart = new BehaviorSubject(this._itemsInCart);
  public totalPriceInCart = new BehaviorSubject(this.totalPriceInCartInit);

  addToCart(product: IProduct, quantity: number) {

    if (!this._itemsInCart.has(product)) {
      this._itemsInCart.set(product, +quantity);
    } else {
      let currentVal = this._itemsInCart.get(product);

      if (currentVal != undefined) {
        this._itemsInCart.set(product, +currentVal + quantity);
      }
    }
    
    this.itemsInCart.next(this._itemsInCart);
    this.getTotalPriceInCart();

    this.totalPriceInCart.next(this.totalPriceInCartGP);
  }

  getTotalPerItem(product: IProduct, qty: number): number {
    return product.discountedPrice * qty;
  }

  getTotalPriceInCart(): number {
    this.totalPriceInCartGP = 0;
    this._itemsInCart.forEach((val, key) => {
      this.totalPriceInCartGP += (val * key.discountedPrice);
    });

    return this.totalPriceInCartGP;
  }



  constructor() {}
}
