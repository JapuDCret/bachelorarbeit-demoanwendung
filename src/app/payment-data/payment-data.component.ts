import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

export interface CheckoutPaymentData {
  paymentOption: 'Rechnung' | 'Überweisung' | 'PayPal' | 'Kreditkarte';
};

@Component({
  selector: 'app-payment-data',
  templateUrl: './payment-data.component.html',
  styleUrls: ['./payment-data.component.css']
})
export class PaymentDataComponent {
  paymentDataFormGroup = this.fb.group({
    paymentOptions: ['Rechnung', Validators.required]
  });

  @Input('stepper') stepper: MatStepper;
  @Output() submitted = new EventEmitter<CheckoutPaymentData>();

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
    
    const checkoutPaymentData: CheckoutPaymentData = {
      paymentOption: this.paymentDataFormGroup.get('paymentOptions').value
    };

    // console.log('submit(): checkoutBillingAddress = ', checkoutBillingAddress);

    this.submitted.emit(checkoutPaymentData);
    
    window.setTimeout(() => {
      this.stepper.next();
    }, 250);
  }
}
