import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';
import { IProduct } from '../../../Models/product';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit{
  
  searchArray: string[];
  searchResults: string[];
  products: IProduct[] | null;

  searchString: string;
  @ViewChild('queryResults') queryResults: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(private shopService: ShopService, private renderer: Renderer2) {

  }
  ngOnInit(): void {
    this.shopService.getProducts().subscribe(data => this.products = data);
    this.shopService.getAllProductsModels().subscribe(data => this.searchArray = data);
  }

  onSearchStringTyping(searchString: string) {
    this.searchResults = this.searchArray.filter((item) => item.toLowerCase().includes(this.searchString.toLowerCase()));
  }

  onInputFocus() {
    this.searchResults = [];
    this.renderer.setStyle(this.queryResults.nativeElement, 'display', 'block');
  }

  onInputBlur() {
    this.searchResults = [];
    this.hideQueryResults();
  }

  onItemClick(value: any) {
    this.searchString = value.target.textContent;
    this.hideQueryResults();
    this.onSubmit();
  }

  onSubmit() {
    this.shopService.changeSearchString(this.searchString);
    this.shopService.changePageNumber(1);
    this.hideQueryResults();
  }

  hideQueryResults() {
    this.renderer.setStyle(this.queryResults.nativeElement, 'display', 'none');
  }

  checkSubmit(key: any) {
    if (key.key == "Enter") {
      this.onSubmit();
    }
  }
}
