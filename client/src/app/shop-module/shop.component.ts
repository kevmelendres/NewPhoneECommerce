import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { IProduct } from '../../Models/product';
import { ShopService } from '../../Services/shop-service.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnChanges{
  products: IProduct[] | null = [];
  selectedProduct: IProduct;
  toggle: boolean;

  sellerName: string | null;

  constructor(private shopService: ShopService, private route: ActivatedRoute) {
  }

  ngOnChanges(): void {
    this.getProducts();
  } 

  ngOnInit(): void {
    this.shopService.searchString.subscribe(value => this.getProducts());

    this.sellerName = this.route.snapshot.queryParamMap.get("seller");

    if (this.sellerName) {
      this.shopService.getProductsBySeller(this.sellerName).subscribe(data => this.products = data);
    }
  }
  
  getProducts() {
    if (this.sellerName) {
      this.shopService.getProductsBySeller(this.sellerName)
        .subscribe(data => this.products = data);
    } else {
      this.shopService.getAllProducts()
        .subscribe(data => this.products = data);
    }
  }

  changeSortedItems(sortBy: string) {
    this.shopService.changeSortedItems(sortBy);
    this.getProducts();
  }

  currentPageChange(pageNumber: number) {
    this.shopService.changePageNumber(pageNumber);
    this.getProducts();
  }

  changeNumberOfItemsToShow(itemsToShow: number) {
    this.shopService.changeItemsToShow(itemsToShow);
    this.getProducts();
  }

  clickedProductOpenDetails(product: IProduct) {
    this.selectedProduct = product;
  }

  emittedToggle(toggle: boolean) {
    this.toggle = toggle;
  }
}
