import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  currentPage: number = 1;
  firstEntryPage: number;
  increment: number = 10;
  numOfPagings: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  totalNumOfProducts: number;
  itemsPerPage: number;
  maxPageNumber: number;
  constructor(private shopService: ShopService) {
    this.firstEntryPage = 1;
    this.shopService.getAllProductsCount().subscribe(data => this.totalNumOfProducts = data);
    this.shopService.getProducts().subscribe(data => this.itemsPerPage = data.length);
    this.maxPageNumber = Math.ceil(this.totalNumOfProducts / this.itemsPerPage);
  }

  validateFirstEntryPage() {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } 

    if (this.firstEntryPage < 1) {
      this.firstEntryPage = 1;
    }
  }

  pageNumberClick(event: any) {
    this.currentPage = parseInt(event.target.text);
  }

  onPrevClick() {
    this.currentPage = this.currentPage - 10;
    this.firstEntryPage = this.firstEntryPage - 10;
    this.validateFirstEntryPage();
  }

  onNextClick() {
    this.currentPage = this.currentPage + 10;
    this.firstEntryPage = this.firstEntryPage + 10;
    this.validateFirstEntryPage();
  }

}
