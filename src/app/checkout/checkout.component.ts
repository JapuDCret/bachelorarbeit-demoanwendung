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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cartFormGroup = this.fb.group({});
    this.billingAddressFormGroup = this.fb.group({});
    this.shippingDataFormGroup = this.fb.group({});
    this.paymentDataFormGroup = this.fb.group({});
    this.finalizeCheckoutFormGroup = this.fb.group({});
  }
}
