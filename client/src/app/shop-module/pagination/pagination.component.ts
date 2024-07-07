import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, input } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';
import { Pagination } from '../../../Services/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit, OnChanges {

  pagination: Pagination = new Pagination();

  pageNumberFromShopService: number;

  @Input() sidebarFilterSwitch: boolean;

  @Output() currentPageChange = new EventEmitter<number>;
  constructor(private shopService: ShopService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["sidebarFilterSwitch"] != undefined) {
      this.pagination.pageNumber = 1;
      this.shopService.totalProductCount.subscribe(data => {
        this.pagination.allItemsCount = data;
        this.pagination.resetPaginationNumbering();
        this.pagination.resetPageNumbersBasedOnCurrentPage();
        this.pagination.enableDisableNextPageClick();
      });
    };
  }

  ngOnInit(): void {
    this.shopService.itemsToShow.subscribe(val => this.pagination.itemsToShow = val);
    this.shopService.totalProductCount.subscribe(data => {
      this.pagination.allItemsCount = data;
    });
    this.pagination.maxPossiblePageNumber = Math.ceil(this.pagination.allItemsCount / this.pagination.itemsToShow);
    this.shopService.pageNumber.subscribe(val => this.pageNumberFromShopService = val);
  }

  onPageNumberClick(page: number) {
    this.pagination.onPageNumberClick(page);
    this.currentPageChange.emit(this.pagination.pageNumber);
  }

  onPrevPaginationClick() {
    this.pagination.onPrevPaginationClick();
    this.currentPageChange.emit(this.pagination.pageNumber);

  }

  onNextPaginationClick() {
    this.pagination.onNextPaginationClick();
    this.currentPageChange.emit(this.pagination.pageNumber);

  }
}
