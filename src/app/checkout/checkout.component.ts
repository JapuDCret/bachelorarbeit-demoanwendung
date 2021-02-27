import { AfterViewInit, Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';

import { NGXLogger } from 'ngx-logger';

import * as LogRocket from 'logrocket';

import { Receipt } from 'src/app/shared/order-svc/order.service';
import { generateFakeUUID } from 'src/app/shared/session-util/session-util';
import { CheckoutBillingAddress } from 'src/app/billing-address/billing-address.component';
import { CheckoutShoppingCartInfo } from 'src/app/shopping-cart/shopping-cart.component';
import { CheckoutShippingData } from 'src/app/shipping-data/shipping-data.component';
import { CheckoutPaymentData } from 'src/app/payment-data/payment-data.component';

export interface CheckoutData {
  shoppingCartInfo: null | CheckoutShoppingCartInfo,
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
    shoppingCartInfo: null,
    billingAddress: null,
    shippingData: null,
    paymentData: null
  }

  receiptData: Receipt = null;

  constructor(
    private log: NGXLogger,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cartFormGroup = this.fb.group({});
    this.billingAddressFormGroup = this.fb.group({});
    this.shippingDataFormGroup = this.fb.group({});
    this.paymentDataFormGroup = this.fb.group({});
    this.finalizeCheckoutFormGroup = this.fb.group({});

    this.log.info('ngOnInit(): retrieving shoppingCartId..');

    const shoppingCartId = generateFakeUUID();
    window.customer.shoppingCartId = shoppingCartId;

    this.log.info('ngOnInit(): shoppingCartId = ', window.customer.shoppingCartId);
  }

  activateLogRocket() {
    // initialize session recording
    LogRocket.init('bachelorarbeit-22hmg/bachelorarbeit', {});
    // start a new session
    LogRocket.startNewSession();
    // make sessionURL accessable
    LogRocket.getSessionURL((sessionURL) => {
      window.logrocketData.sessionURL = sessionURL;
    });
    // pass unique "session"-id to LogRocket
    LogRocket.identify(window.customer.shoppingCartId);
  }

  onShoppingCartSubmit(data: CheckoutShoppingCartInfo): void {
    this.log.info('onShoppingCartSubmit(): data = ', data);

    // enrich LogRocket data with ShoppingCart data
    LogRocket.identify(window.customer.shoppingCartId, {
      itemCount: data.itemCount,
      totalSum: data.totalSum
    });

    this.checkoutData.shoppingCartInfo = data;
  }

  onBillingAddressSubmit(data: CheckoutBillingAddress): void {
    this.log.info('onBillingAddressSubmit(): data = ', data);

    // enrich LogRocket data with BillingAddress data
    LogRocket.identify(window.customer.shoppingCartId, {
      name: data.firstName + ' ' + data.lastName,
      email: data.email
    });

    this.checkoutData.billingAddress = data;
  }

  onShippingDataSubmit(data: CheckoutShippingData): void {
    this.log.info('onShippingDataSubmit(): data = ', data);

    this.checkoutData.shippingData = data;
  }

  onPaymentDataSubmit(data: CheckoutPaymentData): void {
    this.log.info('onPaymentDataSubmit(): data = ', data);

    this.checkoutData.paymentData = data;
  }

  onOrderReceipt(data: Receipt): void {
    this.log.info('onOrderReceipt(): data = ', data);

    this.receiptData = data;

    this.log.info('goToTheShop(): navigating to receipt page');

    this.router.navigate(['receipt']);
  }
}
