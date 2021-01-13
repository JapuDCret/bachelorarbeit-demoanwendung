import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';

export interface Order {
  shoppingCartId: string;
  billingAddress: {
    salutation: string;
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: number;
    postalCode: number;
    city: string;
    email: string;
  };
  shippingData: {
    salutation: string;
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: number;
    postalCode: number;
    city: string;
  };
  paymentData: {
    rechnungData: null | {};
    lastschriftData: null | {
      inhaber: string;
      iban: string;
    };
    paypalData: null | {
      email: string
    };
    kreditkartenData: null | {
      inhaber: string;
      nummer: string;
      cvcCode: string;
      gueltigBisMonat: string;
      gueltigBisJahr: string;
    }
  }
}

export interface Receipt {
  itemCount: number;
  orderId: number;
  paymentType: string;
  shippingData: {
    salutation: string,
    firstName: string;
    lastName: string;
    streetName: string;
    streetNumber: number;
    postalCode: number;
    city: string;
  },
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private static readonly ORDER_ENDPOINT = '/data/order';

  readonly orderServiceUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    console.log('constructor(): config.apiEndpoint = ', config.backend4frontend.apiEndpoint);

    this.orderServiceUrl = config.backend4frontend.apiEndpoint + OrderService.ORDER_ENDPOINT;
    console.log('constructor(): this.orderServiceUrl = ', this.orderServiceUrl);
  }

  public order(order: Order): Observable<Receipt> {
    console.log('order(): placing order, data = ', order);

    return this.http.post<Receipt>(
      this.orderServiceUrl,
      order
    )
      .pipe(
        tap((val) => {
          console.log('order(): returnVal = ', val);
        })
      );
  }
}
