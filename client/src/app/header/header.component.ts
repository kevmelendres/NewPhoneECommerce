import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CartService } from '../../Services/cart-service.service';
import { IProduct } from '../../Models/product';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnChanges{
  itemsOnCart: Map<IProduct, number>;

  constructor(private cartService: CartService) {
    
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.cartService.itemsInCart.subscribe(data => {
      this.itemsOnCart = data;
    });
  }


}
