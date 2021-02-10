import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import { Tracer } from '@opentelemetry/tracing';

import { BE_ShoppingCartItem, ShoppingCartService } from 'src/app/shared/shopping-cart-svc/shopping-cart.service';
import { LocalizationService } from 'src/app/shared/localization-svc/localization.service';
import { SplunkForwardingErrorHandler } from 'src/app/splunk-forwarding-error-handler/splunk-forwarding-error-handler';

export interface ShoppingCart {
  shoppingCartId: string;
  items: ShoppingCartItem[];
}

export interface ShoppingCartItem extends BE_ShoppingCartItem {
  imagePath: string;
}

const IMAGE_MAPPING = {
  1: 'assets/fruits/cantalope.png',
  2: 'assets/fruits/coconut.png',
  3: 'assets/fruits/grapes.png',
  4: 'assets/fruits/peach.png',
  5: 'assets/fruits/pear.png',
  6: 'assets/fruits/pineapple.png',
  7: 'assets/fruits/pomegranate.png',
  8: 'assets/fruits/watermelon.png',
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
    private log: NGXLogger,
    private cartService: ShoppingCartService,
    private localizationService: LocalizationService,
    private errorHandler: SplunkForwardingErrorHandler,
    private tracer: Tracer
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ShoppingCartItem[]> {
    return this.getAndMapShoppingCart(window.customer.shoppingCartId);
  }

  private mappedShoppingCart$: Observable<ShoppingCartItem[]>;

  private getAndMapShoppingCart(shoppingCartId: string): Observable<ShoppingCartItem[]> {
    if (this.mappedShoppingCart$) {
      return this.mappedShoppingCart$;
    }

    const span = this.tracer.startSpan(
      'ShoppingCartDataSource.getAndMapShoppingCart',
      {
        attributes: {
          'shoppingCartId': window.customer.shoppingCartId
        }
      },
    );

    this.log.debug('getAndMapShoppingCart(): requesting translations');
    const translations$ = this.localizationService.getTranslations(span);
    this.log.debug('getAndMapShoppingCart(): requesting shoppingCart');
    const shoppingCart$ = this.cartService.getShoppingCart(shoppingCartId, span);

    this.mappedShoppingCart$ = combineLatest([translations$, shoppingCart$])
      .pipe(
        tap(
          ([translations]) => {
            if (translations == null) {
              this.log.warn('getAndMapShoppingCart(): translations are null!');
            }
          },
          (err) => {
            this.log.warn('getAndMapShoppingCart(): err = ', err);
            
            this.errorHandler.handleError(err, { component: 'ShoppingCartDataSource' });

            span.recordException(err);
          },
          () => {
            if(span.isRecording()) {
              span.end();
            }
          }
        ),
        map(([translations, shoppingCart]) => {
          const mappedCartItems = shoppingCart && shoppingCart.items && shoppingCart.items.map((val) => {
            const imagePath = IMAGE_MAPPING[val.id];

            const name = translations ? translations['de'][val.translationKey] : `***${val.translationKey}***`;

            return { ...val, imagePath, name }
          });

          return mappedCartItems;
        }),
        tap((mappedVal) => {
          this.log.info('getAndMapShoppingCart(): mappedVal = ', mappedVal);
        }),
      );

    return this.mappedShoppingCart$;
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
    this.mappedShoppingCart$ = null;
  }
}
