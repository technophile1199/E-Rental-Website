import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbacktableComponent } from './feedbacktable.component';

describe('FeedbacktableComponent', () => {
  let component: FeedbacktableComponent;
  let fixture: ComponentFixture<FeedbacktableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbacktableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbacktableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
