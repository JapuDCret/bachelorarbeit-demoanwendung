import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { from, Observable } from 'rxjs';

import { MatTable } from '@angular/material/table';

import { CheckoutData } from 'src/app/checkout/checkout.component';
import { ShoppingCartDataSource, ShoppingCartItem } from 'src/app/shopping-cart/shopping-cart-datasource';
import { delay, mergeMap, reduce } from 'rxjs/operators';

@Component({
  selector: 'app-finalize-checkout',
  templateUrl: './finalize-checkout.component.html',
  styleUrls: ['./finalize-checkout.component.css']
})
export class FinalizeCheckoutComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<ShoppingCartItem>;
  dataSource: ShoppingCartDataSource;
  totalSum$: Observable<number>;
  
  finalizeCheckoutFormGroup = this.fb.group({
  });

  @Input('stepper') stepper: MatStepper;
  @Input('checkoutData') checkoutData: CheckoutData;

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

    if(this.finalizeCheckoutFormGroup.valid) {
      console.log('goForward(): calling submit()');
      this.submit();
    }
  }

  private submit(): void {
    console.log('onSubmit()');

    // TODO: submit data
    
    window.setTimeout(() => {
      this.stepper.next();
    }, 250);
  }
}
