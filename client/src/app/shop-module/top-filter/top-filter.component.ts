import { Component, EventEmitter, Output, output } from '@angular/core';

@Component({
  selector: 'app-top-filter',
  templateUrl: './top-filter.component.html',
  styleUrl: './top-filter.component.scss'
})
export class TopFilterComponent {
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

  selectedSort: string = "Sort by price: low-to-high";
  selectedNumOfItemsToShow: number = 10;

  onSortClick(value: any) {
    this.selectedSort = value.target.text;

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
    this.changeNumOfItemsToShow.emit(this.selectedNumOfItemsToShow);
  }
}
