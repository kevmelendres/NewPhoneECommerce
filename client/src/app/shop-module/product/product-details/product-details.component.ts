import { AfterContentChecked, AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, input } from '@angular/core';
import { IProduct } from '../../../../Models/product';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SimilarItemsService } from '../../../../Services/similar-items.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnChanges{
  
  @Input() selectedProduct: IProduct;
  @Input() toggle: boolean;

  similarItems: IProduct[] | null;
  buttonText: string = "Add to Cart";

  @ViewChild('productInfoTemplate') productInfoTemplate: TemplateRef<any>;
  offCanvas: NgbOffcanvas;


  constructor(private offCanvasService: NgbOffcanvas,
    private similarItemsService: SimilarItemsService) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['selectedProduct'] != undefined) {
      if (!changes['selectedProduct'].firstChange) {
        if (this.selectedProduct.availableStocks < 1) {
          this.buttonText = "Not Available";
        } else {
          this.buttonText = "Add to Cart";
        }
        this.getSimilarProducts();
        this.openProductDetailsInfo(this.productInfoTemplate);
      }
    } else {
      if (this.selectedProduct.availableStocks < 1) {
        this.buttonText = "Not Available";
      } else {
        this.buttonText = "Add to Cart";
      }
      this.getSimilarProducts();
      this.openProductDetailsInfo(this.productInfoTemplate);
    }
  }

  openProductDetailsInfo(content: TemplateRef<any>) {
    this.offCanvasService.open(content, { position: 'end'})

  }

  star1(): string {
    if (this.selectedProduct.rating > 0 && this.selectedProduct.rating < 1)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct.rating >= 1)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star2(): string {
    if (this.selectedProduct.rating > 1 && this.selectedProduct.rating < 2)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct.rating >= 2)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star3(): string {
    if (this.selectedProduct.rating > 2 && this.selectedProduct.rating < 3)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct.rating >= 3)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star4(): string {
    if (this.selectedProduct.rating > 3 && this.selectedProduct.rating < 4)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct.rating >= 4)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  star5(): string {
    if (this.selectedProduct.rating > 4 && this.selectedProduct.rating < 5)
      return "fa-solid fa-star-half-stroke";
    if (this.selectedProduct.rating >= 5)
      return "fa-solid fa-star";
    return "fa-star fa-regular";
  }

  getSimilarProducts() {
    this.similarItemsService.changeBrandName(this.selectedProduct.brand);
    this.similarItemsService.getSimilarProducts().subscribe(data => this.similarItems = data);
  }

  isNotSameAsSelectedProduct(product: IProduct) {
    return ((product.model != this.selectedProduct.model) && (product.description != this.selectedProduct.description));
  }

  selectSimilarItem(item: IProduct) {
    
    this.selectedProduct = item;
    if (this.selectedProduct.availableStocks < 1) {
      this.buttonText = "Not Available";
    } else {
      this.buttonText = "Add to Cart";
    }
  }
}
