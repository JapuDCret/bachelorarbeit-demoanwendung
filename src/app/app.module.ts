import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CheckoutComponent } from 'src/app/checkout/checkout.component';
import { ShoppingCartComponent } from 'src/app/shopping-cart/shopping-cart.component';
import { BillingAddressComponent } from 'src/app/billing-address/billing-address.component';
import { ShippingDataComponent } from 'src/app/shipping-data/shipping-data.component';
import { PaymentDataComponent } from 'src/app/payment-data/payment-data.component';
import { FinalizeCheckoutComponent } from 'src/app/finalize-checkout/finalize-checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckoutComponent,
    ShoppingCartComponent,
    BillingAddressComponent,
    ShippingDataComponent,
    PaymentDataComponent,
    FinalizeCheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
