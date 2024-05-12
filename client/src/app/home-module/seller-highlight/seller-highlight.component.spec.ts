import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerHighlightComponent } from './seller-highlight.component';

describe('SellerHighlightComponent', () => {
  let component: SellerHighlightComponent;
  let fixture: ComponentFixture<SellerHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerHighlightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
