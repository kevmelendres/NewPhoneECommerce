import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtobuyMainComponent } from './howtobuy-main.component';

describe('HowtobuyMainComponent', () => {
  let component: HowtobuyMainComponent;
  let fixture: ComponentFixture<HowtobuyMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HowtobuyMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowtobuyMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
