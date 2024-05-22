import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { SellerProductListPair } from '../../../Models/keyvaluepair';
import { ShopService } from '../../../Services/shop-service.service';
import { IProductC } from '../../../Models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  sellerWithProductsList: SellerProductListPair[] = [];
  productSellers: string[] | null = [];

  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  constructor(private shopService: ShopService, private router: Router) { }

  ngOnInit(): void {
    this.getProductSellers();

    this.shopService.getRandomSellersAndProducts().subscribe(data => {
      Object.entries(data).map((entries) => {
        let i: number = 0;
        let addToList = new SellerProductListPair();
        addToList.seller = entries[0];
        addToList.products = [];

        while (entries[1][i] != undefined) {
          addToList.products.push(entries[1][i] as unknown as IProductC);
          i++;
        }
        this.sellerWithProductsList.push(addToList);
      });
    });
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  getProductSellers(topValue?: number) {
    this.shopService.getProductSellers(topValue).subscribe(data => this.productSellers = data)
  }

  onSellerClick(sellerName: string) {
    this.router.navigate(['/shop'], { queryParams: { seller: sellerName } })
  };
}
