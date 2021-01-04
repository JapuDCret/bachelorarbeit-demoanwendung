import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-payment-data',
  templateUrl: './payment-data.component.html',
  styleUrls: ['./payment-data.component.css']
})
export class PaymentDataComponent {
  paymentDataFormGroup = this.fb.group({
  });

  @Input('stepper') stepper: MatStepper;

  constructor(private fb: FormBuilder) { }

  goBack(): void {
    console.log('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    console.log('goForward()');

    if(this.paymentDataFormGroup.valid) {
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
