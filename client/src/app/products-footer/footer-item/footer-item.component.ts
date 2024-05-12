import { Component, Input } from '@angular/core';
import { IProduct } from '../../../Models/product';

@Component({
  selector: 'footer-item',
  templateUrl: './footer-item.component.html',
  styleUrl: './footer-item.component.scss'
})
export class FooterItemComponent {
  @Input() item: IProduct;
}
