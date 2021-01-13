import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';

export interface BE_ShoppingCart {
  shoppingCartId: string;
  items: BE_ShoppingCartItem[];
}

export interface BE_ShoppingCartItem {
  id: number;
  translationKey: string;
  price: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private static readonly CART_ENDPOINT = '/data/cart';

  readonly cartServiceUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    console.log('constructor(): config.apiEndpoint = ', config.apiEndpoint);

    this.cartServiceUrl = config.apiEndpoint + ShoppingCartService.CART_ENDPOINT;
    console.log('constructor(): this.cartServiceUrl = ', this.cartServiceUrl);
  }

  public getShoppingCart(shoppingCartId: string): Observable<BE_ShoppingCart> {
    console.log('getShoppingCart(): requested shopping cart with id = ', shoppingCartId);

    return this.http.get<BE_ShoppingCart>(
      this.cartServiceUrl + '/' + shoppingCartId
    )
    .pipe(
      tap((val) => {
        console.log('getShoppingCart(): returnVal = ', val);
      })
    );
  }
}
