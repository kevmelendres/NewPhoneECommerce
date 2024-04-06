import { Component, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  currentPage: number = 1;

  firstEntryPage: number;
  increment: number = 10;

  constructor() {
    this.firstEntryPage = 1;
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
