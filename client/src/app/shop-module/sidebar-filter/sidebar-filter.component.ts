import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrl: './sidebar-filter.component.scss'
})
export class SidebarFilterComponent implements OnInit{
  productBrands: string[] | null;
  productSellers: string[] | null;
  productColors: string[] | null;
  availability: string[] = ['All Products', 'In Stock', 'Out of Stock'];

  brandsSwitch: boolean;
  sellersSwitch: boolean;

  toggleAllSwitch: string = "Show all";
  sellersToShowLabel: string = "Top Sellers";
  brandsToShowLabel: string = "Top Brands";

  selectedProductBrand: string = 'All Brands';
  selectedAvailability: string = 'All Products';
  selectedSeller: string = 'All Sellers';

  @Output() selectedProductBrandEmit = new EventEmitter<string>();
  @Output() selectedAvailabilityEmit = new EventEmitter<string>();
  @Output() selectedSellerEmit = new EventEmitter<string>();
  
  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.getProductBrands(5);
    this.getProductSellers(5);
    this.getProductColors(5);
  }

  getProductBrands(topValue?: number) {
    this.shopService.getProductBrands(topValue).subscribe(data => this.productBrands = ["All Brands", ...data!]);
  }

  getProductSellers(topValue?: number) {
    this.shopService.getProductSellers(topValue).subscribe(data => this.productSellers = ["All Sellers", ...data!])
  }

  getProductColors(topValue?: number) {
    this.shopService.getProductColors(topValue).subscribe(data => this.productColors = ["All", ...data!])
  }

  onBrandsToViewChange() {
    if (this.brandsSwitch) {
      this.getProductBrands();
      this.brandsToShowLabel = "All Brands"

    } else {
      this.getProductBrands(5);
      this.brandsToShowLabel = "Top Brands"
    }
  }

  onSellersToViewChange() {
    if (this.sellersSwitch) {
      this.getProductSellers();
      this.sellersToShowLabel = "All Sellers"

    } else {
      this.getProductSellers(5);
      this.sellersToShowLabel = "Top Sellers"
    }
  }

  onProductBrandSelect() {
    this.shopService.changeSelectedBrand(this.selectedProductBrand);
    this.selectedProductBrandEmit.emit(this.selectedProductBrand);
  }

  onSellerSelect() {
    this.shopService.changeSelectedSeller(this.selectedSeller);
    this.selectedSellerEmit.emit(this.selectedSeller);
  }

  onAvailabilitySelect() {
    this.shopService.changeSelectedAvailability(this.selectedAvailability);
    this.selectedAvailabilityEmit.emit(this.selectedAvailability);
  }
}
