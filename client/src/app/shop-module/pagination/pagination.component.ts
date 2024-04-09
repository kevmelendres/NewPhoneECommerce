import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges{
  currentPage: number = 1;
  firstEntryPage: number;
  increment: number = 10;
  numOfPagings: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  totalNumOfProducts: number;
  itemsPerPage: number;
  @Input() changeItemsPerPage: number;
  maxPageNumber: number;

  @Output() currentPageChange = new EventEmitter<number>;
  constructor(private shopService: ShopService) {
    this.firstEntryPage = 1;
    this.shopService.getAllProductsCount().subscribe(data => this.totalNumOfProducts = data);

    this.shopService.getProducts().subscribe(data => {
      if (data != null) {
        this.itemsPerPage = data.length
      }
    });
    console.log("initial max page number!!");
    this.maxPageNumber = Math.ceil(this.totalNumOfProducts / this.itemsPerPage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.itemsPerPage = this.changeItemsPerPage;
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
    this.currentPageChange.emit(parseInt(event.target.text));
    console.log(this.itemsPerPage);
  }

  onPrevClick() {
    this.currentPage = this.currentPage - 10;
    this.firstEntryPage = this.firstEntryPage - 10;
    this.validateFirstEntryPage();
    this.currentPageChange.emit(this.currentPage);
  }

  onNextClick() {
    this.currentPage = this.currentPage + 10;
    this.firstEntryPage = this.firstEntryPage + 10;
    this.validateFirstEntryPage();
    this.currentPageChange.emit(this.currentPage);
  }

}
