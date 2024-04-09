import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrl: './sidebar-filter.component.scss'
})
export class SidebarFilterComponent implements OnInit{
  productBrands: string[];
  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.getProductBrands();
  }

  getProductBrands() {
    this.shopService.getProductBrands().subscribe(data => this.productBrands = data)
  }

}
