import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from 'src/environments/environment';
import { AppModule } from 'src/app/app.module';
import { CheckoutBillingAddress } from 'src/app/billing-address/billing-address.component';
import { CheckoutPaymentData } from 'src/app/payment-data/payment-data.component';
import { CheckoutShippingData } from 'src/app/shipping-data/shipping-data.component';
import { CheckoutShoppingCartInfo } from 'src/app/shopping-cart/shopping-cart.component';

declare global {
  interface Window {
    customer: {
      shoppingCartId: string;
    },
    frontendModel: {
      shoppingCartInfo: null | CheckoutShoppingCartInfo;
      billingAddress: null | CheckoutBillingAddress;
      shippingData: null | CheckoutShippingData;
      paymentData: null | CheckoutPaymentData;
    },
    logrocketData: {
      sessionURL: string;
    }
  }
}

window.customer = {
  shoppingCartId: 'n/a'
}
window.frontendModel = {
  shoppingCartInfo: null,
  billingAddress: null,
  shippingData: null,
  paymentData: null
}
window.logrocketData = {
  sessionURL: 'n/a'
}

if (environment.environment === "production") {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
