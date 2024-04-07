import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../../Models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{
  @Input() product: IProduct;

  ngOnInit(): void {
    this.product.discountedPrice = this.product.price * (100 - this.product.discount) / 100;
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


}
