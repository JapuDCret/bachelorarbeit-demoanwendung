import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface BE_ShoppingCart {
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

  private readonly baseUrl = 'http://localhost:9082/data/cart';

  seed: string;

  constructor(private http: HttpClient) {
    console.log('constructor(): this.baseUrl = ', this.baseUrl);

    this.seed = this.generateSeed();
  }

  private generateSeed(): string {
    var result           = '';
    var characters       = 'abcdef0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 8; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public getShoppingCart(): Observable<BE_ShoppingCart> {
    return this.http.get<BE_ShoppingCart>(
      this.baseUrl,
      { params: { seed: this.seed } }
    )
    .pipe(
      tap((val) => {
        console.log('getShoppingCart(): val = ', val);
      })
    );
  }
}
