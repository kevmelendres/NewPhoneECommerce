import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCartComponent } from './current-cart.component';

describe('CurrentCartComponent', () => {
  let component: CurrentCartComponent;
  let fixture: ComponentFixture<CurrentCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentCartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
