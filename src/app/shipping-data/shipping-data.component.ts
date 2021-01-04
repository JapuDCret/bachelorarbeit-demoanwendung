import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-shipping-data',
  templateUrl: './shipping-data.component.html',
  styleUrls: ['./shipping-data.component.css']
})
export class ShippingDataComponent {
  shippingDataFormGroup = this.fb.group({
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

  constructor(private fb: FormBuilder) {}

  goBack(): void {
    console.log('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    console.log('goForward()');

    if(this.shippingDataFormGroup.valid) {
      console.log('goForward(): calling submit()');
      this.submit();
    }
  }

  private submit(): void {
    console.log('onSubmit()');

    // TODO: submit data
    
    window.setTimeout(() => {
      this.stepper.next();
    }, 2500)
  }
}
