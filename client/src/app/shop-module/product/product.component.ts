import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { IProduct } from '../../../Models/product';
import { CartService } from '../../../Services/cart-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit{
  @Input() product: IProduct;
  @Output() emitClickedProduct = new EventEmitter<IProduct>();
  @Output() emitToggle = new EventEmitter<boolean>();
  toggleVal: boolean = true;
  productQty: string;

  show: boolean = true;

  @ViewChild('standardToast') standardToast: TemplateRef<any>;
  constructor(private cartService: CartService) { }

  buttonText: string = "Add to Cart";

  ngOnInit(): void {
    if (this.product.availableStocks < 1) {
      this.buttonText = "Not Available";
    }

  }

  star1(): string {
    if (this.product.rating > 0 && this.product.rating < 1)
      return "fa-solid fa-star-half-stroke";
    if (this.product.rating >= 1)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star2(): string {
    if (this.product.rating > 1 && this.product.rating < 2)
      return "fa-solid fa-star-half-stroke";
    if (this.product.rating >= 2)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star3(): string {
    if (this.product.rating > 2 && this.product.rating < 3)
      return "fa-solid fa-star-half-stroke";
    if (this.product.rating >= 3)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star4(): string {
    if (this.product.rating > 3 && this.product.rating < 4)
      return "fa-solid fa-star-half-stroke";
    if (this.product.rating >= 4)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star5(): string {
    if (this.product.rating > 4 && this.product.rating < 5)
      return "fa-solid fa-star-half-stroke";
    if (this.product.rating >= 5)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  onProductCardClick() {
    this.emitClickedProduct.emit(this.product);
    this.emitToggle.emit(this.toggleVal);
    this.toggleVal = !this.toggleVal;
  }

  addToCart(product: IProduct) {
    this.cartService.addToCart(product, +this.productQty);
  }

  addQty() {
    if (this.productQty != undefined) {
      let val = +this.productQty + 1;
      this.productQty = val.toString();
    } else {
      this.productQty = "1"
    }
  }

  subtractQty() {
    let val = +this.productQty - 1;
    this.productQty = val.toString();
  }



}
