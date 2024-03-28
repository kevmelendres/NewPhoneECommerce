import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../Services/shop-service.service';
import { IProduct } from '../../Models/product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  products: IProduct[] = [];

  constructor(private shopService: ShopService) {
  }

  ngOnInit(): void {
    this.shopService.getProducts().subscribe(data => this.products = data);
  }
  
}
