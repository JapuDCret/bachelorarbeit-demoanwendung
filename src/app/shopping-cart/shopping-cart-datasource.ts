import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BE_ShoppingCartItem, ShoppingCartService } from 'src/app/shared/shopping-cart-svc/shopping-cart.service';
import { LocalizationService } from 'src/app/shared/localization-svc/localization.service';

export interface ShoppingCart {
  shoppingCartId: string;
  items: ShoppingCartItem[];
}

export interface ShoppingCartItem extends BE_ShoppingCartItem {
  imagePath: string;
}

const IMAGE_MAPPING = {
  0: '/assets/fruits/cantalope.png',
  1: '/assets/fruits/coconut.png',
  2: '/assets/fruits/grapes.png',
  3: '/assets/fruits/peach.png',
  4: '/assets/fruits/pear.png',
  5: '/assets/fruits/pineapple.png',
  6: '/assets/fruits/pomegranate.png',
  7: '/assets/fruits/watermelon.png',
};

/**
 * Data source for the ShoppingCart view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable({
  providedIn: 'root',
})
export class ShoppingCartDataSource extends DataSource<ShoppingCartItem> {

  readonly shoppingCartId: string;

  constructor(
    private cartService: ShoppingCartService,
    private localizationService: LocalizationService
  ) {
    super();

    this.shoppingCartId = this.generateSeed();
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

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ShoppingCartItem[]> {
    return this.getAndMapShoppingCart(this.shoppingCartId);
  }

  private getAndMapShoppingCart(shoppingCartId: string): Observable<ShoppingCartItem[]> {
    const translations$ = this.localizationService.getTranslations();
    const shoppingCart$ = this.cartService.getShoppingCart(shoppingCartId);
    
    return combineLatest(translations$, shoppingCart$)
    .pipe(
      map(([translations, shoppingCart]) => {
        const mappedCartItems = shoppingCart && shoppingCart.items && shoppingCart.items.map((val) => {
          return { ...val, imagePath: IMAGE_MAPPING[val.id], name: translations["de"][val.translationKey] }
        });

        return mappedCartItems;
      }),
      tap((val) => {
        console.log('getAndMapShoppingCart(): val = ', val);
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }
}
