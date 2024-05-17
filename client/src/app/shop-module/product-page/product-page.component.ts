import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IProduct } from '../../../Models/product';
import { ShopService } from '../../../Services/shop-service.service';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit{
  selectedProductId: string | null;
  selectedProduct: IProduct;

  constructor(private shopService: ShopService, private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.selectedProductId = paramMap.get('id');
      this.shopService.getProductByID(this.selectedProductId)
        .subscribe(product => this.selectedProduct = product);
    })
  }

  star1(): string {
    if (this.selectedProduct!.rating > 0 && this.selectedProduct!.rating < 1)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct!.rating >= 1)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star2(): string {
    if (this.selectedProduct!.rating > 1 && this.selectedProduct!.rating < 2)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct!.rating >= 2)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star3(): string {
    if (this.selectedProduct!.rating > 2 && this.selectedProduct!.rating < 3)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct!.rating >= 3)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star4(): string {
    if (this.selectedProduct!.rating > 3 && this.selectedProduct!.rating < 4)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct!.rating >= 4)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star5(): string {
    if (this.selectedProduct!.rating > 4 && this.selectedProduct!.rating < 5)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct!.rating >= 5)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

}
