import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { CheckoutData } from 'src/app/checkout/checkout.component';

@Component({
  selector: 'app-finalize-checkout',
  templateUrl: './finalize-checkout.component.html',
  styleUrls: ['./finalize-checkout.component.css']
})
export class FinalizeCheckoutComponent {
  finalizeCheckoutFormGroup = this.fb.group({
  });

  @Input('stepper') stepper: MatStepper;
  @Input('checkoutData') checkoutData: CheckoutData;

  constructor(private fb: FormBuilder) {}

  goBack(): void {
    console.log('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    console.log('goForward()');

    if(this.finalizeCheckoutFormGroup.valid) {
      console.log('goForward(): calling submit()');
      this.submit();
    }
  }

  private submit(): void {
    console.log('onSubmit()');

    // TODO: submit data
    
    window.setTimeout(() => {
      this.stepper.next();
    }, 250);
  }
}
