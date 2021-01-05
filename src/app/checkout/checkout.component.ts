import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CheckoutShoppingCart } from 'src/app/shopping-cart/shopping-cart.component';
import { CheckoutBillingAddress } from 'src/app/billing-address/billing-address.component';
import { CheckoutShippingData } from 'src/app/shipping-data/shipping-data.component';
import { CheckoutPaymentData } from 'src/app/payment-data/payment-data.component';

export interface CheckoutData {
  shoppingCart: null | CheckoutShoppingCart;
  billingAddress: null | CheckoutBillingAddress;
  shippingData: null | CheckoutShippingData;
  paymentData: null | CheckoutPaymentData;
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
    shoppingCart: null,
    billingAddress: null,
    shippingData: null,
    paymentData: null
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cartFormGroup = this.fb.group({});
    this.billingAddressFormGroup = this.fb.group({});
    this.shippingDataFormGroup = this.fb.group({});
    this.paymentDataFormGroup = this.fb.group({});
    this.finalizeCheckoutFormGroup = this.fb.group({});
  }

  onShoppingCartSubmit(data: CheckoutShoppingCart): void {
    console.log('onShoppingCartSubmit(): data = ', data);

    this.checkoutData.shoppingCart = data;
  }

  onBillingAddressSubmit(data: CheckoutBillingAddress): void {
    console.log('onBillingAddressSubmit(): data = ', data);

    this.checkoutData.billingAddress = data;
  }

  onShippingDataSubmit(data: CheckoutShippingData): void {
    console.log('onShippingDataSubmit(): data = ', data);
    
    this.checkoutData.shippingData = data;
  }

  onPaymentDataSubmit(data: CheckoutPaymentData): void {
    console.log('onPaymentDataSubmit(): data = ', data);
    
    this.checkoutData.paymentData = data;
  }
}
