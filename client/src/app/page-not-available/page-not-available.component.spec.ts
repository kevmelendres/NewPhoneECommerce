import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotAvailableComponent } from './page-not-available.component';

describe('PageNotAvailableComponent', () => {
  let component: PageNotAvailableComponent;
  let fixture: ComponentFixture<PageNotAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageNotAvailableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageNotAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
