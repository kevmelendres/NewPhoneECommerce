import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../Models/product';
import { ShopService } from '../../Services/shop-service.service';

@Component({
  selector: 'app-products-footer',
  templateUrl: './products-footer.component.html',
  styleUrl: './products-footer.component.scss'
})
export class ProductsFooterComponent implements OnInit{
  dealsOfTheDay: IProduct[] | null;
  onSaleProducts: IProduct[] | null;
  bestSellerProducts: IProduct[] | null;
  whatsNewProducts: IProduct[] | null;
  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.shopService.getDealsOfTheDay().subscribe(data => this.dealsOfTheDay = data);
    this.shopService.getOnSaleProducts().subscribe(data => this.onSaleProducts = data);
    this.shopService.getBestSellerProducts().subscribe(data => this.bestSellerProducts = data);
    this.shopService.getWhatsNewProducts().subscribe(data => this.whatsNewProducts = data);
  }

}
