import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OverlayModule } from '@angular/cdk/overlay';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppComponent } from 'src/app/app.component';
import { AppConfigModule } from 'src/app/app-config-module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppObservabilityModule } from 'src/app/app-observability.module';
import { BillingAddressComponent } from 'src/app/billing-address/billing-address.component';
import { CheckoutComponent } from 'src/app/checkout/checkout.component';
import { ErrorDialogComponent } from 'src/app/error-dialog/error-dialog.component';
import { FinalizeCheckoutComponent } from 'src/app/finalize-checkout/finalize-checkout.component';
import { PaymentDataComponent } from 'src/app/payment-data/payment-data.component';
import { ReceiptPageComponent } from 'src/app/receipt-page/receipt-page.component';
import { ShippingDataComponent } from 'src/app/shipping-data/shipping-data.component';
import { ShoppingCartComponent } from 'src/app/shopping-cart/shopping-cart.component';

@NgModule({
  declarations: [
    AppComponent,
    BillingAddressComponent,
    CheckoutComponent,
    ErrorDialogComponent,
    FinalizeCheckoutComponent,
    PaymentDataComponent,
    ReceiptPageComponent,
    ShippingDataComponent,
    ShoppingCartComponent,
  ],
  imports: [
    BrowserModule,
    AppConfigModule,
    AppRoutingModule,
    AppObservabilityModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      // serverLoggingUrl: '/api/logs',
      // serverLogLevel: NgxLoggerLevel.INFO,
    }),
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
