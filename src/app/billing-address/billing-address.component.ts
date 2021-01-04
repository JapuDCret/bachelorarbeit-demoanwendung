import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.css']
})
export class BillingAddressComponent {
  billingAddressFormGroup = this.fb.group({
    salutation: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    streetName: [null, Validators.required],
    streetNo: [null, Validators.required],
    city: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ]
  });

  @Input('stepper') stepper: MatStepper;

  constructor(private fb: FormBuilder) { }

  goBack(): void {
    console.log('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    console.log('goForward()');

    console.log('goForward(): this.billingAddressFormGroup.valid = ', this.billingAddressFormGroup.valid);

    if(this.billingAddressFormGroup.valid) {
      console.log('goForward(): calling submit()');
      this.submit();
    }
  }

  private submit(): void {
    console.log('submit()');

    // TODO: submit data
    
    window.setTimeout(() => {
      this.stepper.next();
    }, 2500)
  }
}
