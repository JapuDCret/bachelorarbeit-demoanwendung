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
  paymentFormGroup: FormGroup;
  finalizeFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.cartFormGroup = this._formBuilder.group({});
    this.billingAddressFormGroup = this._formBuilder.group({});
    this.shippingDataFormGroup = this._formBuilder.group({});
    this.paymentFormGroup = this._formBuilder.group({});
    this.finalizeFormGroup = this._formBuilder.group({});
  }

}
