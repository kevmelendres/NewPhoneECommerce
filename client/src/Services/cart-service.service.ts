import { EventEmitter, Injectable, Output } from '@angular/core';
import { IProduct } from '../Models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  _itemsInCart = new Map<IProduct, number>();

  public itemsInCart = new BehaviorSubject(this._itemsInCart);

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

  }

  constructor() {}
}
