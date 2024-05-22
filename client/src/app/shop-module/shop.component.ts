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

  constructor(private shopService: ShopService, private route: ActivatedRoute) {
  }

  ngOnChanges(): void {
    this.getProducts();
  } 

  ngOnInit(): void {
    this.shopService.searchString.subscribe(value => this.getProducts());

    let sellerName: string | null = this.route.snapshot.queryParamMap.get("seller");
    console.log(sellerName);
    if (sellerName) {
      this.shopService.getProductsBySeller(sellerName).subscribe(data => this.products = data);
    }
  }
  
  getProducts() {
    this.shopService.getProducts()
      .subscribe(data => this.products = data);
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
