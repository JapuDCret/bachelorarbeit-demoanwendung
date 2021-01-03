import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeCheckoutComponent } from './finalize-checkout.component';

describe('FinalizeCheckoutComponent', () => {
  let component: FinalizeCheckoutComponent;
  let fixture: ComponentFixture<FinalizeCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalizeCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizeCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
