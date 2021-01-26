import { EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Component } from '@angular/core';

import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { MatStepper } from '@angular/material/stepper';

import { NGXLogger } from 'ngx-logger';

import { CheckoutBillingAddress } from 'src/app/billing-address/billing-address.component';

export interface CheckoutShippingData {
  salutation: string;
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: number;
  city: string;
  postalCode: number;
}

@Component({
  selector: 'app-shipping-data',
  templateUrl: './shipping-data.component.html',
  styleUrls: ['./shipping-data.component.css']
})
export class ShippingDataComponent implements OnChanges {
  useBillingAddressFormGroup = this.fb.group({
    useBillingAddress: [true, Validators.required]
  });

  shippingDataFormGroup = this.fb.group({
    salutation: [{ value: null }, Validators.required],
    firstName: [{ value: null }, Validators.required],
    lastName: [{ value: null }, Validators.required],
    streetName: [{ value: null }, Validators.required],
    streetNumber: [{ value: null }, Validators.required],
    city: [{ value: null }, Validators.required],
    postalCode: [{ value: null }, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ]
  });

  loading: boolean = false;

  @Input('stepper') stepper: MatStepper;
  @Input('billingAddressData') billingAddressData: null | CheckoutBillingAddress;
  @Output() submitted = new EventEmitter<CheckoutShippingData>();

  constructor(
    private log: NGXLogger,
    private fb: FormBuilder
  ) {
    const useBillingAddressControl = this.useBillingAddressFormGroup.get('useBillingAddress');
    useBillingAddressControl.valueChanges.subscribe(
      (newValue) => {
        // this.log.info('changeUseBillingAddress(): useBillingAddressControl.value = ', useBillingAddressControl.value);
        // this.log.info('changeUseBillingAddress(): newValue = ', newValue);

        if (this.billingAddressData != null && newValue) {
          this.setFormToBillingAddressData(this.billingAddressData);
          this.setDisabledStateOfForm(true);
        } else {
          this.setDisabledStateOfForm(false);
          this.clearForm();
        }
      }
    );
  }

  ngOnChanges(): void {
    const useBillingAddress = this.useBillingAddressFormGroup.get('useBillingAddress').value;

    if (this.billingAddressData != null && useBillingAddress) {
      this.setFormToBillingAddressData(this.billingAddressData);
    }
  }

  private getAllControls(): AbstractControl[] {
    return [
      this.shippingDataFormGroup.get('salutation'),
      this.shippingDataFormGroup.get('firstName'),
      this.shippingDataFormGroup.get('lastName'),
      this.shippingDataFormGroup.get('streetName'),
      this.shippingDataFormGroup.get('streetNumber'),
      this.shippingDataFormGroup.get('city'),
      this.shippingDataFormGroup.get('postalCode'),
    ];
  }

  private setFormToBillingAddressData(billingAddressData: CheckoutBillingAddress): void {
    Object.keys(billingAddressData).forEach((key) => {
      const control = this.shippingDataFormGroup.get(key);
      if (control != null) {
        control.markAsTouched();
        control.markAsDirty();
        control.setValue(billingAddressData[key]);
      }
    });
  }

  private clearForm(): void {
    const controls = this.getAllControls();

    controls.forEach((control) => {
      control.setValue(null);
      control.markAsPristine();
      control.markAsUntouched();
    });
  }

  private setDisabledStateOfForm(disabledState: boolean): void {
    const controls = this.getAllControls();

    controls.forEach((control) => {
      // if(disabledState) {
      //   control.disable({ onlySelf: true });
      // } else {
      //   control.enable();
      // }
    });
  }

  goBack(): void {
    this.log.info('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    this.log.info('goForward()');

    const useBillingAddress = this.useBillingAddressFormGroup.get('useBillingAddress').value;

    this.log.info('goForward(): useBillingAddress = ', useBillingAddress);
    this.log.info('goForward(): this.billingAddressFormGroup.valid = ', this.useBillingAddressFormGroup.valid);

    if (useBillingAddress || this.shippingDataFormGroup.valid) {
      this.log.info('goForward(): calling submit()');
      this.submit();
    }
  }

  private submit(): void {
    this.log.info('submit()');

    const checkoutShippingData: CheckoutShippingData = {
      salutation: this.shippingDataFormGroup.get('salutation').value,
      firstName: this.shippingDataFormGroup.get('firstName').value,
      lastName: this.shippingDataFormGroup.get('lastName').value,
      streetName: this.shippingDataFormGroup.get('streetName').value,
      streetNumber: this.shippingDataFormGroup.get('streetNumber').value,
      city: this.shippingDataFormGroup.get('city').value,
      postalCode: this.shippingDataFormGroup.get('postalCode').value
    };

    // this.log.info('submit(): checkoutShippingData = ', checkoutShippingData);

    this.loading = true;

    window.frontendModel.shippingData = checkoutShippingData;
    this.submitted.emit(checkoutShippingData);

    window.setTimeout(() => {
      this.loading = false;

      this.stepper.next();
    }, 250);
  }
}
