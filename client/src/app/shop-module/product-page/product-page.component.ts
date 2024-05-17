import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { IProduct } from '../../../Models/product';
import { ShopService } from '../../../Services/shop-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CartService } from '../../../Services/cart-service.service';
import { SimilarItemsService } from '../../../Services/similar-items.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {
  selectedProductId: string | null;
  selectedProduct: IProduct;
  productQty: string = '';

  buttonText: string = "Add to Cart";
  availability: string = "Local Stocks via Online Shop"

  similarItems: IProduct[] | null;

  @ViewChild('snackbar') snackbar: ElementRef;

  constructor(private shopService: ShopService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private renderer: Renderer2,
    private similarItemService: SimilarItemsService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.selectedProductId = paramMap.get('id');
      this.shopService.getProductByID(this.selectedProductId)
        .subscribe(product => {
          this.selectedProduct = product;

          if (this.selectedProduct.availableStocks < 1) {
            this.buttonText = "Not Available";
            this.availability = "Currently no stocks available";
          } else {
            this.buttonText = "Add to Cart";
            this.availability = "Local Stocks via Online Shop";
          }

          this.getSimilarItems();
        });

      

    });
  }

  subtractQty() {
    let val = +this.productQty - 1;
    this.productQty = val.toString();
  }

  addQty() {
    if (this.productQty != undefined) {
      let val = +this.productQty + 1;
      this.productQty = val.toString();
    } else {
      this.productQty = "1"
    }
  }

  openSnackBar() {
    this.renderer.addClass(this.snackbar.nativeElement, 'show');

    setTimeout(() => {
      this.renderer.removeClass(this.snackbar.nativeElement, 'show');
    }, 2000);
  }

  addToCart(product: IProduct) {
    this.cartService.addToCart(product, +this.productQty);
    this.openSnackBar();
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

  getSimilarItems() {
    this.similarItemService.changeBrandName(this.selectedProduct.brand);
    this.similarItemService.changeItemsToShow(20);
    this.similarItemService.getSimilarProducts().subscribe(similarItems => this.similarItems = similarItems)
  }

  onSimilarItemClick(similarItem: IProduct) {
    this.router.navigateByUrl(`/shop/product/${similarItem.id}`)
  }
}
