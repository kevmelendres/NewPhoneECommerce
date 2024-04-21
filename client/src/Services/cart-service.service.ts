import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { IProduct } from '../Models/product';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { count } from 'console';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _itemsInCart = new Map<IProduct, number>();
  totalPriceInCartInit: number = 0;

  private totalPriceInCartGP: number = 0;

  public itemsInCart = new BehaviorSubject(this._itemsInCart);
  public totalPriceInCart = new BehaviorSubject(this.totalPriceInCartInit);

  constructor(@Inject(DOCUMENT) private document: Document) {
    const localStorage = document.defaultView?.localStorage;

    if (localStorage) {
      if (localStorage.getItem("shoppingCartLocalStored")) {
        var localCartStored = localStorage.getItem("shoppingCartLocalStored");
        //var parsed = JSON.parse(localCartStored!);
        //console.log(localCartStored);
        //console.log(JSON.parse(localCartStored!));
      }

    }

  }

  addToCart(product: IProduct, quantity: number) {
    
    if (!this._itemsInCart.has(product)) {
      this._itemsInCart.set(product, +quantity);
    }
    else
    {
      if ((this._itemsInCart.get(product)! > 0 && quantity < 0) || quantity > 0) {
        let currentVal = this._itemsInCart.get(product);
        if (currentVal != undefined) {
          this._itemsInCart.set(product, +currentVal + quantity);
        }
      }
    }
    this.refreshDataInViews();
    this.storeDataToLocalStorage(this._itemsInCart);
  }

  storeDataToLocalStorage(cart: Map<IProduct, number>) {
    let cartArray: any = [];

    cart.forEach((qty, product) => {
      cartArray.push(JSON.stringify({ product }));
    })

    localStorage.setItem("shoppingCartLocalStored", cartArray);
  }



  refreshDataInViews() {
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

  getQuantityOfProduct(product: IProduct): number {
    return this._itemsInCart.get(product)!;
  }

  deleteProduct(product: IProduct) {
    this._itemsInCart.delete(product);
    this.refreshDataInViews;
  }
}
