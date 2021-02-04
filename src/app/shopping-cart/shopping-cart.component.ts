import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { FormBuilder } from '@angular/forms';

import { MatStepper } from '@angular/material/stepper';
import { MatTable } from '@angular/material/table';

import { from, Observable } from 'rxjs';
import { delay, mergeMap, reduce, tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

import { Tracer } from '@opentelemetry/tracing';
import { Meter } from '@opentelemetry/metrics';
import { BoundValueRecorder } from '@opentelemetry/api-metrics';

import { ShoppingCartDataSource } from 'src/app/shopping-cart/shopping-cart-datasource';
import { ShoppingCartItem } from 'src/app/shopping-cart/shopping-cart-datasource';

export interface CheckoutShoppingCartInfo {
  shoppingCartId: string;
  totalSum: number;
  itemCount: number;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements AfterViewInit {
  @ViewChild(MatTable) table: MatTable<ShoppingCartItem>;
  totalSum$: Observable<number>;
  totalSum: null | number;
  itemCount: number;

  loading: boolean = false;

  shoppingCartFormGroup = this.fb.group({
  });

  @Input('stepper') stepper: MatStepper;
  @Output() submitted = new EventEmitter<CheckoutShoppingCartInfo>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  readonly displayedColumns = ['imagePath', 'amount', 'name', 'price'];

  readonly totalSumRecorder: BoundValueRecorder;
  readonly itemCountRecorder: BoundValueRecorder;

  constructor(
    private log: NGXLogger,
    private fb: FormBuilder,
    private dataSource: ShoppingCartDataSource,
    private tracer: Tracer,
    private meter: Meter
  ) {
    const totalSumRecorderUnbound = this.meter.createValueRecorder('totalSum', {  });
    this.totalSumRecorder = totalSumRecorderUnbound.bind({ component: 'ShoppingCartComponent' });
    
    const itemCountRecorderUnbound = this.meter.createValueRecorder('itemCount', {  });
    this.itemCountRecorder = itemCountRecorderUnbound.bind({ component: 'ShoppingCartComponent' });
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;

    const shoppingCart$ = this.dataSource.connect();

    this.totalSum = null;

    this.totalSum$ = shoppingCart$
      .pipe(
        delay(0), // fix ExpressionChangedAfterItHasBeenCheckedError
        mergeMap((cartItems) => from(cartItems).pipe(
          reduce<ShoppingCartItem, number>((totalPrice, cartItem) => (cartItem.amount * cartItem.price) + totalPrice, 0)
        )),
        tap(totalSum => {
          this.totalSum = totalSum;
        })
      );

    shoppingCart$
      .subscribe(
        (cartItems) => {
          this.itemCount = cartItems.length
        }
      );
  }

  goForward(): void {
    /** this will submit the form and eventually call #submit() */
    this.log.info('goForward(): calling submit()');

    this.submit();
  }

  private submit(): void {
    this.log.info('submit()');

    this.loading = true;
    
    const span = this.tracer.startSpan(
      'ShoppingCartComponent.submit',
      {
        attributes: {
          'shoppingCartId': window.customer.shoppingCartId
        }
      }
    );
    const shoppingCartInfo = {
      shoppingCartId: window.customer.shoppingCartId,
      totalSum: this.totalSum,
      itemCount: this.itemCount,
    }
    
    this.totalSumRecorder.record(this.totalSum);
    this.itemCountRecorder.record(this.itemCount);

    window.frontendModel.shoppingCartInfo = shoppingCartInfo;
    this.submitted.emit(shoppingCartInfo);

    window.setTimeout(() => {
      this.loading = false;

      span.end();

      this.stepper.next();
    }, 2000 * this.itemCount);
  }
}
