import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

export interface CheckoutBillingAddress {
  salutation: string;
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: number;
  city: string;
  postalCode: number;
  email: string;
}

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
    streetNumber: [null, Validators.required],
    city: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    email: [null, Validators.compose([
      Validators.required, Validators.email])
    ],
  });

  @Input('stepper') stepper: MatStepper;
  @Output() submitted = new EventEmitter<CheckoutBillingAddress>();

  constructor(private fb: FormBuilder) { }

  goBack(): void {
    console.log('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    console.log('goForward()');

    console.log('goForward(): this.billingAddressFormGroup.valid = ', this.billingAddressFormGroup.valid);

    if (this.billingAddressFormGroup.valid) {
      console.log('goForward(): calling submit()');
      this.submit();
    }
  }

  private submit(): void {
    console.log('submit()');
    
    const checkoutBillingAddress: CheckoutBillingAddress = {
      salutation: this.billingAddressFormGroup.get('salutation').value,
      firstName: this.billingAddressFormGroup.get('firstName').value,
      lastName: this.billingAddressFormGroup.get('lastName').value,
      streetName: this.billingAddressFormGroup.get('streetName').value,
      streetNumber: this.billingAddressFormGroup.get('streetNumber').value,
      city: this.billingAddressFormGroup.get('city').value,
      postalCode: this.billingAddressFormGroup.get('postalCode').value,
      email: this.billingAddressFormGroup.get('email').value
    };

    // console.log('submit(): checkoutBillingAddress = ', checkoutBillingAddress);

    this.submitted.emit(checkoutBillingAddress);

    window.setTimeout(() => {
      this.stepper.next();
    }, 250);
  }
}
