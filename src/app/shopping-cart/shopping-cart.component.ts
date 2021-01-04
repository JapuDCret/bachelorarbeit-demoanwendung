import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTable } from '@angular/material/table';
import { from, Observable } from 'rxjs';
import { delay, mergeMap, reduce } from 'rxjs/operators';

import { ShoppingCartDataSource, ShoppingCartItem } from 'src/app/shopping-cart/shopping-cart-datasource';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<ShoppingCartItem>;
  dataSource: ShoppingCartDataSource;
  totalSum$: Observable<number>;

  shoppingCartFormGroup = this.fb.group({
  });

  @Input('stepper') stepper: MatStepper;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['imagePath', 'amount', 'name', 'price'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.dataSource = new ShoppingCartDataSource();
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;

    this.totalSum$ = this.dataSource.connect()
      .pipe(
        delay(0), // fix ExpressionChangedAfterItHasBeenCheckedError
        mergeMap((cartItems) => from(cartItems).pipe(
          reduce<ShoppingCartItem, number>((totalPrice, cartItem) => (cartItem.amount * cartItem.price) + totalPrice, 0)
        ))
      );
  }

  goBack(): void {
    console.log('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    console.log('goForward()');

    /** this will submit the form and eventually call #onSubmit() */
    console.log('goForward(): calling submit()');
    this.submit();
  }

  private submit(): void {
    console.log('submit()');

    this.stepper.next();
  }
}
