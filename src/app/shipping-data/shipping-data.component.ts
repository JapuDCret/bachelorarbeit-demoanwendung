import { EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { CheckoutBillingAddress } from 'src/app/billing-address/billing-address.component';

export interface CheckoutShippingData {
  salutation: string;
  firstName: string;
  lastName: string;
  streetName: string;
  streetNo: number;
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
  @Input('billingAddressData') billingAddressData: null | CheckoutBillingAddress;
  @Output() submitted = new EventEmitter<CheckoutShippingData>();

  constructor(private fb: FormBuilder) {
    const useBillingAddressControl = this.useBillingAddressFormGroup.get('useBillingAddress');
    useBillingAddressControl.valueChanges.subscribe(
      (newValue) => {
        console.log('changeUseBillingAddress(): useBillingAddressControl.value = ', useBillingAddressControl.value);
        console.log('changeUseBillingAddress(): newValue = ', newValue);
        
        if(this.billingAddressData != null && newValue) {
          this.setFormToBillingAddressData(this.billingAddressData);
        }
      }
    );
  }

  ngOnChanges(): void {
    const useBillingAddress = this.useBillingAddressFormGroup.get('useBillingAddress').value;

    if(this.billingAddressData != null && useBillingAddress) {
      this.setFormToBillingAddressData(this.billingAddressData);
    }
  }

  private setFormToBillingAddressData(billingAddressData: CheckoutBillingAddress): void {
    this.shippingDataFormGroup.get('salutation').setValue(billingAddressData.salutation);
    this.shippingDataFormGroup.get('firstName').setValue(billingAddressData.firstName);
    this.shippingDataFormGroup.get('lastName').setValue(billingAddressData.lastName);
    this.shippingDataFormGroup.get('streetName').setValue(billingAddressData.streetName);
    this.shippingDataFormGroup.get('streetNo').setValue(billingAddressData.streetNo);
    this.shippingDataFormGroup.get('city').setValue(billingAddressData.city);
    this.shippingDataFormGroup.get('postalCode').setValue(billingAddressData.postalCode);
  }

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
    
    const checkoutShoppingData: CheckoutShippingData = {
      salutation: this.shippingDataFormGroup.get('salutation').value,
      firstName: this.shippingDataFormGroup.get('firstName').value,
      lastName: this.shippingDataFormGroup.get('lastName').value,
      streetName: this.shippingDataFormGroup.get('streetName').value,
      streetNo: this.shippingDataFormGroup.get('streetNo').value,
      city: this.shippingDataFormGroup.get('city').value,
      postalCode: this.shippingDataFormGroup.get('postalCode').value
    };

    // console.log('submit(): checkoutShoppingData = ', checkoutShoppingData);

    this.submitted.emit(checkoutShoppingData);
    
    window.setTimeout(() => {
      this.stepper.next();
    }, 250);
  }
}
