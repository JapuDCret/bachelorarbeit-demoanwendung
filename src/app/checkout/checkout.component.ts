import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CheckoutBillingAddress } from 'src/app/billing-address/billing-address.component';
import { CheckoutShippingData } from 'src/app/shipping-data/shipping-data.component';

export interface CheckoutData {
  billingAddress: null | CheckoutBillingAddress;
  shippingData: null | CheckoutShippingData;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartFormGroup: FormGroup;
  billingAddressFormGroup: FormGroup;
  shippingDataFormGroup: FormGroup;
  paymentDataFormGroup: FormGroup;
  finalizeCheckoutFormGroup: FormGroup;

  checkoutData: CheckoutData = {
    billingAddress: null,
    shippingData: null,
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cartFormGroup = this.fb.group({});
    this.billingAddressFormGroup = this.fb.group({});
    this.shippingDataFormGroup = this.fb.group({});
    this.paymentDataFormGroup = this.fb.group({});
    this.finalizeCheckoutFormGroup = this.fb.group({});
  }

  onBillingAddressSubmit(data: CheckoutBillingAddress): void {
    console.log('onBillingAddressSubmit(): data = ', data);

    this.checkoutData.billingAddress = data;
  }

  onShippingDataSubmit(data: CheckoutShippingData): void {
    console.log('onShippingDataSubmit(): data = ', data);
    
    this.checkoutData.shippingData = data;
  }
}
