import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';
import { IProduct } from '../../../Models/product';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit{
  
  searchArray: string[] = ["Martin", "James", "Jamie", "Jameson", "Jamelia", "Jamela", "StackOverflow"];
  searchResults: string[];
  products: IProduct[] | null;


  searchString: string;
  @ViewChild('queryResults') queryResults: ElementRef;

  constructor(private shopService: ShopService) {

  }
  ngOnInit(): void {
    this.shopService.getProducts()
      .subscribe(data => this.products = data);
  }

  onSearchStringTyping(searchString: string) {
    this.searchResults = this.searchArray.filter((item) => item.toLowerCase().includes(this.searchString.toLowerCase()));
  }
}
