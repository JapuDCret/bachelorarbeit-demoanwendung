import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

import { FormBuilder } from '@angular/forms';

import { MatStepper } from '@angular/material/stepper';
import { MatTable } from '@angular/material/table';

import { from, Observable } from 'rxjs';
import { delay, mergeMap, reduce } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import { ShoppingCartDataSource } from 'src/app/shopping-cart/shopping-cart-datasource';
import { ShoppingCartItem } from 'src/app/shopping-cart/shopping-cart-datasource';

export interface CheckoutShopItem {
  itemId: number;
  name: string;
  price: number;
  imagePath: string;
}

export interface CheckoutShoppingCart {
  contents: CheckoutShopItem[];
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements AfterViewInit {
  @ViewChild(MatTable) table: MatTable<ShoppingCartItem>;
  totalSum$: Observable<number>;
  itemCount: number;

  loading: boolean = false;

  shoppingCartFormGroup = this.fb.group({
  });

  @Input('stepper') stepper: MatStepper;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['imagePath', 'amount', 'name', 'price'];

  constructor(
    private log: NGXLogger,
    private fb: FormBuilder,
    private dataSource: ShoppingCartDataSource
  ) { }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;

    const shoppingCart$ = this.dataSource.connect();

    this.totalSum$ = shoppingCart$
      .pipe(
        delay(0), // fix ExpressionChangedAfterItHasBeenCheckedError
        mergeMap((cartItems) => from(cartItems).pipe(
          reduce<ShoppingCartItem, number>((totalPrice, cartItem) => (cartItem.amount * cartItem.price) + totalPrice, 0)
        ))
      );

    shoppingCart$
      .subscribe(
        (cartItems) => {
          this.itemCount = cartItems.length
        }
      );
  }

  goBack(): void {
    this.log.info('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    this.log.info('goForward()');

    /** this will submit the form and eventually call #submit() */
    this.log.info('goForward(): calling submit()');
    this.submit();
  }

  private submit(): void {
    this.log.info('submit()');

    this.loading = true;

    window.setTimeout(() => {
      this.loading = false;

      this.stepper.next();
    }, 2000 * this.itemCount);
  }
}
