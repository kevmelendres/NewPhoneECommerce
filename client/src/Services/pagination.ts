export class Pagination {

  pageNumber: number = 1;
  itemsToShow: number;
  totalNumberOfPages: number = 15;

  enableNextPageClick: boolean = true;
  allItemsCount: number;
  pageNumberList: number[]
  
  maxPossiblePageNumber: number;

  constructor() {
    this.pageNumberList = [...Array(this.totalNumberOfPages).keys()];
  }

  onPageNumberClick(pageNum: number) {
    this.pageNumber = pageNum;
  }

  onNextPaginationClick() {
    let lastPageNumberShown = Math.ceil(this.pageNumber / this.totalNumberOfPages) * this.totalNumberOfPages;
    this.pageNumber = (lastPageNumberShown + 1);
    this.resetPageNumbersBasedOnCurrentPage();
    this.enableDisableNextPageClick();
  }

  resetPageNumbersBasedOnCurrentPage() {
    let z: number = Math.ceil(this.pageNumber / this.totalNumberOfPages) * this.totalNumberOfPages;
    this.pageNumberList = (this.range(z - this.totalNumberOfPages, z, 1));
  }

  range(start: number, end: number, step: number): number[] {
    let arrayNumbers: number[] = [];

    let i = start;
    while (i < end) {
      arrayNumbers.push(i);
      i += step;
    }
    return arrayNumbers;
  }

  enableDisableNextPageClick() {
    let newLastPageNumber = Math.ceil(this.pageNumber / this.totalNumberOfPages) * this.totalNumberOfPages;
    this.enableNextPageClick = true

    if (newLastPageNumber >= this.maxPossiblePageNumber) {
      this.enableNextPageClick = false;
    }

    if (newLastPageNumber < this.totalNumberOfPages) {
      this.enableNextPageClick = false;
    }
  }

  onPrevPaginationClick() {
    let lastPageNumberShown = Math.ceil(this.pageNumber / this.totalNumberOfPages) * this.totalNumberOfPages;
    this.pageNumber = (lastPageNumberShown - this.totalNumberOfPages * 2 + 1);
    this.resetPageNumbersBasedOnCurrentPage();
    this.enableDisableNextPageClick();
  }

  setMaxPossiblePageNumber() {
    this.maxPossiblePageNumber = Math.ceil(this.allItemsCount / this.itemsToShow);
  }

  resetPaginationNumbering() {
    this.maxPossiblePageNumber = Math.ceil(this.allItemsCount / this.itemsToShow);

    if (this.maxPossiblePageNumber <= this.totalNumberOfPages) {
      this.enableNextPageClick = false;
    }
  }
}


