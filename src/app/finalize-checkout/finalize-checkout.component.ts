import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { from, Observable } from 'rxjs';
import { delay, mergeMap, reduce } from 'rxjs/operators';

import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { CheckoutData } from 'src/app/checkout/checkout.component';
import { ShoppingCartDataSource } from 'src/app/shopping-cart/shopping-cart-datasource';
import { ShoppingCartItem } from 'src/app/shopping-cart/shopping-cart-datasource';
import { OrderService, Receipt } from 'src/app/shared/order-svc/order.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-finalize-checkout',
  templateUrl: './finalize-checkout.component.html',
  styleUrls: ['./finalize-checkout.component.css']
})
export class FinalizeCheckoutComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<ShoppingCartItem>;
  totalSum$: Observable<number>;
  shoppingCartId$: string;

  loading: boolean = false;
  
  finalizeCheckoutFormGroup = this.fb.group({
  });

  @Input('stepper') stepper: MatStepper;
  @Input('checkoutData') checkoutData: CheckoutData;
  @Output() receipt = new EventEmitter<Receipt>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['imagePath', 'amount', 'name', 'price'];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cartDataSource: ShoppingCartDataSource,
    private orderService: OrderService,
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.table.dataSource = this.cartDataSource;

    const shoppingCart$ = this.cartDataSource.connect();

    this.totalSum$ = shoppingCart$
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
    console.log('submit()');

    this.loading = true;

    this.orderService.order({
      shoppingCartId: this.cartDataSource.shoppingCartId,
      billingAddress: this.checkoutData.billingAddress,
      shippingData: this.checkoutData.shippingData,
      paymentData: {
        rechnungData: this.checkoutData.paymentData.rechnungData,
        lastschriftData: this.checkoutData.paymentData.lastschriftData,
        paypalData: this.checkoutData.paymentData.paypalData,
        kreditkartenData: this.checkoutData.paymentData.kreditkartenData && {
          inhaber: this.checkoutData.paymentData.kreditkartenData.inhaber,
          nummer: this.checkoutData.paymentData.kreditkartenData.nummer,
          cvcCode: padNumber(this.checkoutData.paymentData.kreditkartenData.cvcCode, 3),
          gueltigBisMonat: padNumber(this.checkoutData.paymentData.kreditkartenData.gueltigBisMonat, 2),
          gueltigBisJahr: padNumber(this.checkoutData.paymentData.kreditkartenData.gueltigBisJahr, 2)
        }
      },
    })
    .subscribe(
      (receipt) => {
        console.log('submit(): receipt = ', receipt);

        this.loading = false;

        this.receipt.emit(receipt);
      },
      err => {
        console.log('submit(): err = ', err);

        this.loading = false;

        this.dialog.open(ErrorDialogComponent, {
          data: {
            action: 'Bestellung ausführen',
            error: err.error,
            message: err.message,
          },
        });
      }
    );
  }
}

function padNumber(num: number, size: number): string {
  return ('000000000' + num).substr(-size);
}
