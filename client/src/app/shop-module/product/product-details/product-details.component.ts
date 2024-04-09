import { AfterContentChecked, AfterViewChecked, Component, ElementRef, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild, input } from '@angular/core';
import { IProduct } from '../../../../Models/product';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnChanges{
  
  @Input() selectedProduct: IProduct;
  @Input() toggle: boolean;

  @ViewChild('productInfoTemplate') productInfoTemplate: TemplateRef<any>;
  offCanvas: NgbOffcanvas;

  constructor(private offCanvasService: NgbOffcanvas) { }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['selectedProduct'] != undefined) {
      if (!changes['selectedProduct'].firstChange) {
        this.openProductDetailsInfo(this.productInfoTemplate);
      }
    } else {
      this.openProductDetailsInfo(this.productInfoTemplate);
    }
  }

  openProductDetailsInfo(content: TemplateRef<any>) {
    this.offCanvasService.open(content, { position: 'end' })
  }
}
