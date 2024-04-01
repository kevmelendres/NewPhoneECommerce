import { Component } from '@angular/core';

@Component({
  selector: 'app-top-filter',
  templateUrl: './top-filter.component.html',
  styleUrl: './top-filter.component.scss'
})
export class TopFilterComponent {
  sortBy: string[] = [
    "Sort by popularity",
    "Sort by average rating",
    "Sort by latest",
    "Sort by price: low-to-high",
    "Sort by price: high-to-low",
    "Sort by availability",
    "Sort by review count",
  ];

  selectedSort: string = "Sort by popularity";

  onSortClick(value: any) {
    this.selectedSort = value.target.text;
  }
}
