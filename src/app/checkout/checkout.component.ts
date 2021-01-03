import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartFormGroup: FormGroup;
  billingAddressFormGroup: FormGroup;
  shippingDataFormGroup: FormGroup;
  paymentDataFormGroup: FormGroup;
  finalizeCheckoutFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.cartFormGroup = this._formBuilder.group({});
    this.billingAddressFormGroup = this._formBuilder.group({});
    this.shippingDataFormGroup = this._formBuilder.group({});
    this.paymentDataFormGroup = this._formBuilder.group({});
    this.finalizeCheckoutFormGroup = this._formBuilder.group({});
  }

}
