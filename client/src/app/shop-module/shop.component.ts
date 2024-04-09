import { Component } from '@angular/core';
import { IProduct } from '../../Models/product';
import { ShopService } from '../../Services/shop-service.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  products: IProduct[] | null = [];
  sortBy: string = "Price: Low-to-High";
  itemsToShow: number = 10;
  pageNumber: number = 1;
  constructor(private shopService: ShopService) {
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.sortBy, this.itemsToShow, this.pageNumber)
      .subscribe(data => this.products = data);
  }

  changeSortedItems(sortBy: string) {
    this.sortBy = sortBy;
    this.getProducts();
  }

  currentPageChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.getProducts();
  }

  changeNumberOfItemsToShow(itemsToShow: number) {
    this.itemsToShow = itemsToShow;
    this.getProducts();
  }
}
