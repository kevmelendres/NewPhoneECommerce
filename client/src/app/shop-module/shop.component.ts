import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { IProduct } from '../../Models/product';
import { ShopService } from '../../Services/shop-service.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnChanges{
  products: IProduct[] | null = [];
  selectedProduct: IProduct;
  toggle: boolean;

  constructor(private shopService: ShopService) {
  }

  ngOnChanges(): void {
    this.getProducts();
  } 

  ngOnInit(): void {
    this.shopService.searchString.subscribe(value => this.getProducts());
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
