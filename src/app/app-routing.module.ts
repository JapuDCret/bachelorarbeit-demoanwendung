import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckoutComponent } from 'src/app/checkout/checkout.component';
import { ReceiptPageComponent } from './receipt-page/receipt-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/checkout', pathMatch: 'full' },
  { path: 'checkout', pathMatch: 'prefix', component: CheckoutComponent },
  { path: 'receipt', pathMatch: 'prefix', component: ReceiptPageComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
