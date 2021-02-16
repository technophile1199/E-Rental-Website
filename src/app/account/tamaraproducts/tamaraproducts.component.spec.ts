import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamaraproductsComponent } from './tamaraproducts.component';

describe('TamaraproductsComponent', () => {
  let component: TamaraproductsComponent;
  let fixture: ComponentFixture<TamaraproductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamaraproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamaraproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
