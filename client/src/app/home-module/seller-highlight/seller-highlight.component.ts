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
  imageSrc: number[] = [];

  ngOnInit(): void {
    this.numberOfSlides = Math.floor(this.products.length / this.itemsToShowPerSlide);
    this.numberOfSlidesList = [...Array(this.numberOfSlides).keys()]
    while (this.imageSrc.length < 100){
      this.imageSrc.push(this.getRandomInt(1, 400));
    }
  }

  getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  getRandomImg(randomInt: number): string {
    let getImage: number = this.imageSrc[randomInt];
    let randomImg = `https://picsum.photos/id/${getImage}/150/200`;

    return randomImg;
  }

}
