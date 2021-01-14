import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';

import { MatStepper } from '@angular/material/stepper';

import { NGXLogger } from 'ngx-logger';

export interface CheckoutPaymentData {
  paymentOption: 'Rechnung' | 'Überweisung' | 'PayPal' | 'Kreditkarte';
  rechnungData: {},
  paypalData: {
    email: string;
  };
  lastschriftData: {
    inhaber: string;
    iban: string;
  };
  kreditkartenData: {
    inhaber: string;
    nummer: string;
    cvcCode: number;
    gueltigBisMonat: number;
    gueltigBisJahr: number;
  };
};

const IBANRegex = (/[A-Z]{2}\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4} ?[\d]{0,2}/).compile();
const IBANValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
  const valid = IBANRegex.test(control.value);
  return valid ? null : { ibanInvalid: { value: control.value } };
}

@Component({
  selector: 'app-payment-data',
  templateUrl: './payment-data.component.html',
  styleUrls: ['./payment-data.component.css']
})
export class PaymentDataComponent {
  paymentDataFormGroup = this.fb.group({
    paymentOptions: ['Rechnung', Validators.required]
  });

  paypalFormGroup = this.fb.group({
    email: [null, Validators.compose([
      Validators.required, Validators.email
    ])]
  });

  lastschriftFormGroup = this.fb.group({
    inhaber: [null, Validators.required],
    iban: [null, Validators.compose([
      Validators.required, IBANValidator
    ])]
  });

  kreditkartenFormGroup = this.fb.group({
    inhaber: [null, Validators.required],
    nummer: [null, Validators.compose([
      Validators.required, Validators.min(12), Validators.max(16),
    ])],
    cvcCode: [null, Validators.compose([
      Validators.required, Validators.min(3), Validators.max(3),
    ])],
    gueltigBisMonat: [null, Validators.compose([
      Validators.required, Validators.min(2), Validators.max(2),
    ])],
    gueltigBisJahr: [null, Validators.compose([
      Validators.required, Validators.min(4), Validators.max(4),
    ])],
  });

  loading: boolean = false;

  @Input('stepper') stepper: MatStepper;
  @Output() submitted = new EventEmitter<CheckoutPaymentData>();

  constructor(
    private log: NGXLogger,
    private fb: FormBuilder
  ) {
    const paymentOptionsControl = this.paymentDataFormGroup.get('paymentOptions');
    paymentOptionsControl.valueChanges.subscribe(
      (newValue) => {
        this.log.info('paymentOptionsControl.valueChanges(): paymentOptionsControl.value = ', paymentOptionsControl.value);
        this.log.info('paymentOptionsControl.valueChanges(): newValue = ', newValue);
      }
    );
  }

  goBack(): void {
    this.log.info('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    this.log.info('goForward()');

    const paymentOption = this.paymentDataFormGroup.get('paymentOptions').value;

    /* intentionally missing paypal validation and erroneous default */
    var hasValidSubform = true;
    if (paymentOption === 'per_rechnung') {
      // no validation required
      hasValidSubform = true;
    } else if (paymentOption === 'per_lastschrift') {
      hasValidSubform = this.lastschriftFormGroup.valid;
    } else if (paymentOption === 'per_kreditkarte') {
      // no validation required
      hasValidSubform = this.kreditkartenFormGroup.valid;
    }

    if (this.paymentDataFormGroup.valid) {
      this.log.info('goForward(): calling submit()');
      this.submit();
    }
  }

  private submit(): void {
    this.log.info('submit()');

    const checkoutPaymentData: CheckoutPaymentData = {
      paymentOption: this.paymentDataFormGroup.get('paymentOptions').value,
      rechnungData: {},
      paypalData: {
        email: this.paypalFormGroup.get('email').value,
      },
      lastschriftData: {
        inhaber: this.lastschriftFormGroup.get('inhaber').value,
        iban: this.lastschriftFormGroup.get('iban').value,
      },
      kreditkartenData: {
        inhaber: this.kreditkartenFormGroup.get('inhaber').value,
        nummer: this.kreditkartenFormGroup.get('nummer').value,
        cvcCode: this.kreditkartenFormGroup.get('cvcCode').value,
        gueltigBisMonat: this.kreditkartenFormGroup.get('gueltigBisMonat').value,
        gueltigBisJahr: this.kreditkartenFormGroup.get('gueltigBisJahr').value,
      },
    };

    // this.log.info('submit(): checkoutPaymentData = ', checkoutPaymentData);

    this.loading = true;

    this.submitted.emit(checkoutPaymentData);

    window.setTimeout(() => {
      this.loading = false;

      this.stepper.next();
    }, 250);
  }
}
