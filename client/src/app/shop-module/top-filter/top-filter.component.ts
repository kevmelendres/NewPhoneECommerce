import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { query } from 'express';

@Component({
  selector: 'app-top-filter',
  templateUrl: './top-filter.component.html',
  styleUrl: './top-filter.component.scss'
})
export class TopFilterComponent implements OnInit{

  selectedSort: string;
  selectedNumOfItemsToShow: number;
  searchString: string;
  sellerName: string | null;
  showSeller: string | null;

  constructor(private shopService: ShopService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.shopService.sortBy.subscribe(sortBy => this.selectedSort = sortBy);
    this.shopService.itemsToShow.subscribe(sortBy => this.selectedNumOfItemsToShow = sortBy);
    this.shopService.searchString.subscribe(searchString => this.searchString = searchString);

    this.route.queryParams.subscribe(queryParams => {
      this.sellerName = queryParams["seller"];
      this.showSeller = queryParams["showSeller"];
    })

  }

  sortBy: string[] = [
    "Sort by average rating",
    "Sort by latest",
    "Sort by price: low-to-high",
    "Sort by price: high-to-low",
    "Sort by availability",
  ];

  numOfItemsToShow: number[] = [
    10,20,30,40,50
  ];

  @Output() changeSort = new EventEmitter<string>;
  @Output() changeNumOfItemsToShow = new EventEmitter<number>;

  onSortClick(value: any) {
    this.selectedSort = value.target.text;
    this.shopService.returnToPageOne();
    this.shopService.changePageNumber(1);

    switch (this.selectedSort) {
      case "Sort by average rating":
        this.changeSort.emit("Average Rating");
        break;
      case "Sort by latest":
        this.changeSort.emit("Latest");
        break;
      case "Sort by price: low-to-high":
        this.changeSort.emit("Price: Low-to-High");
        break;
      case "Sort by price: high-to-low":
        this.changeSort.emit("Price: High-to-Low");
        break;
      case "Sort by availability":
        this.changeSort.emit("Availability");
        break;
      default: {
        this.changeSort.emit("Price: Low-to-High");
        break;
      } 
    }
  }

  onNumOfItemsToShowClick(value: any) {
    this.selectedNumOfItemsToShow = parseInt(value.target.text);
    this.shopService.returnToPageOne();
    this.shopService.changePageNumber(1);
    this.changeNumOfItemsToShow.emit(this.selectedNumOfItemsToShow);
    
  }

  deleteFilterResults() {
    this.searchString = "";
    this.shopService.changeSearchString(this.searchString);
    this.shopService.returnToPageOne();

    if (this.sellerName) {
      this.router.navigateByUrl("/shop");
    }

    this.shopService.getAllProducts();
  }
}
