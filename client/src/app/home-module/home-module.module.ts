import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NgbCarousel, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { SellerHighlightComponent } from './seller-highlight/seller-highlight.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent,
    SellerHighlightComponent,
    
  ],
  imports: [
    CommonModule,
    NgbCarousel,
    NgbCarouselModule,
    RouterModule
  ]
})
export class HomeModule { }
