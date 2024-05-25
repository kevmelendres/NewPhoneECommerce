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

  pageNoItemsToShow: number;

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

    this.shopService.pageNoItemsToShow.subscribe(page => this.pageNoItemsToShow = page);
  }
  
  getProducts() {
    if (this.sellerName) {
      this.shopService.getProductsBySeller(this.sellerName)
        .subscribe(data => {

          this.shopService.changePageNoItemsToShow(0);
          this.products = data;
          if (data?.length == 0) {
            this.shopService.changePageNoItemsToShow(this.shopService.pageNumberGP);
          };
        });
    } else {
      this.shopService.getAllProducts()
        .subscribe(data => {
          this.shopService.changePageNoItemsToShow(0);
          this.products = data;
          if (data?.length == 0) {
            this.shopService.changePageNoItemsToShow(this.shopService.pageNumberGP);
          };
        });
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
