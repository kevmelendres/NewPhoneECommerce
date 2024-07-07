import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';
import { IProduct } from '../../../Models/product';
import { Route, Router } from '@angular/router';

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

  arrowkeyLocation = 0;
  constructor(private shopService: ShopService, private renderer: Renderer2, private router: Router) {

  }
  ngOnInit(): void {
    this.shopService.getAllProducts().subscribe(data => this.products = data);
    this.shopService.getAllProductsModels().subscribe(data => this.searchArray = data);
  }

  onSearchStringTyping(searchString: string) {
    this.searchResults = [searchString + " - Shop Search", ...this.searchArray.filter((item) => item.toLowerCase().includes(searchString.toLowerCase()))];
    this.arrowkeyLocation = 0;
    this.renderer.setProperty(this.queryResults.nativeElement, 'scrollTop', (this.arrowkeyLocation - 2) * 32.6);
    this.showQueryResults();

    if (this.searchString == '') {
      this.hideQueryResults();
    }
  } 

  onInputFocus() {
    this.searchResults = [];
    this.arrowkeyLocation = 0;
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
    this.shopService.changeSelectedAvailability("All Products");
    this.shopService.changeSelectedBrand("All Brands");
    this.shopService.changeSelectedSeller("All Sellers");

    this.shopService.changePageNumber(1);
    this.hideQueryResults();
    if (this.router.url != "/shop") {
      this.router.navigateByUrl("/shop");
    }
    this.shopService.getAllProducts();
  }

  hideQueryResults() {
    this.renderer.setStyle(this.queryResults.nativeElement, 'display', 'none');
  }

  showQueryResults() {
    this.renderer.setStyle(this.queryResults.nativeElement, 'display', 'block');
  }

  checkSubmit(key: any) {
    if (key.key == "Enter") {
      this.onSubmit();
    }
  }

  onKeyDown(key: any) {
    if (this.searchResults.length != 0) {
      
      if (key.key == 'ArrowDown') {
        this.arrowkeyLocation++;

        if (this.arrowkeyLocation > this.searchResults.length -1) {
          this.arrowkeyLocation = this.searchResults.length - 1;
        }

        if (this.arrowkeyLocation != 0) {
          this.searchString = this.searchResults[this.arrowkeyLocation];
        } else {
          this.searchString = this.searchResults[0].substring(0, this.searchResults[0].length - 14);
        }
      }

      if (key.key == 'ArrowUp') {
        this.arrowkeyLocation--;
        if (this.arrowkeyLocation < 0) {
          this.arrowkeyLocation = 0;
        }

        if (this.arrowkeyLocation != 0) {
          this.searchString = this.searchResults[this.arrowkeyLocation];
        } else {
          this.searchString = this.searchResults[0].substring(0, this.searchResults[0].length - 14);
        }
      }

      this.renderer.setProperty(this.queryResults.nativeElement, 'scrollTop', (this.arrowkeyLocation - 2) * 32.6);

      if (key.key == 'Escape') {
        this.searchResults = [];
        this.arrowkeyLocation = 0;
        this.searchString = '';
      }

      if (key.key == 'Enter') {
        this.onSubmit();
      }
    }
  }
}
