import { Component, Input, OnInit } from '@angular/core';
import { ShopService } from '../../../Services/shop-service.service';
import { SellerProductListPair } from '../../../Models/keyvaluepair';
import { IProduct, IProductC } from '../../../Models/product';
import { NgbCarouselModule, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'seller-highlight',
  templateUrl: './seller-highlight.component.html',
  styleUrl: './seller-highlight.component.scss'
})
export class SellerHighlightComponent implements OnInit {

  sellerWithProductsList: SellerProductListPair[] = [];

  @Input() seller: string;
  @Input() products: IProductC[];

  itemsToShowPerSlide: number = 5;
  numberOfSlides: number;
  numberOfSlidesList: number[];

  ngOnInit(): void {
    this.numberOfSlides = Math.floor(this.products.length / this.itemsToShowPerSlide);
    this.numberOfSlidesList = [...Array(this.numberOfSlides).keys()]
    console.log(this.numberOfSlidesList);
  }

}
