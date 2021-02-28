import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordConsentDialogComponent } from './record-consent-dialog.component';

describe('RecordConsentDialogComponent', () => {
  let component: RecordConsentDialogComponent;
  let fixture: ComponentFixture<RecordConsentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordConsentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordConsentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
