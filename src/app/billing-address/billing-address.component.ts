import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatStepper } from '@angular/material/stepper';

import { NGXLogger } from 'ngx-logger';

import { Tracer } from '@opentelemetry/tracing';

import { AddressValidationService } from 'src/app/shared/address-validation-svc/address-validation.service';
import { SplunkForwardingErrorHandler } from 'src/app/splunk-forwarding-error-handler/splunk-forwarding-error-handler';

export interface CheckoutBillingAddress {
  salutation: string;
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber: number;
  city: string;
  postalCode: number;
  email: string;
}

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.css']
})
export class BillingAddressComponent {
  billingAddressFormGroup = this.fb.group({
    salutation: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    streetName: [null, Validators.required],
    streetNumber: [null, Validators.required],
    city: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    email: [null, Validators.compose([
      Validators.required, Validators.email])
    ],
  });

  loading: boolean = false;

  @Input('stepper') stepper: MatStepper;
  @Output() submitted = new EventEmitter<CheckoutBillingAddress>();

  addressValidationResult: string = null;

  constructor(
    private log: NGXLogger,
    private fb: FormBuilder,
    private addressValidationService: AddressValidationService,
    private errorHandler: SplunkForwardingErrorHandler,
    private tracer: Tracer
  ) { }

  goBack(): void {
    this.log.info('goBack()');

    this.stepper.previous();
  }

  goForward(): void {
    this.log.info('goForward(): this.billingAddressFormGroup.valid = ', this.billingAddressFormGroup.valid);

    if (this.billingAddressFormGroup.valid) {
      this.log.info('goForward(): calling submit()');
      
      this.submit();
    }
  }

  private submit(): void {
    this.log.info('submit()');

    this.addressValidationResult = null;

    const checkoutBillingAddress: CheckoutBillingAddress = {
      salutation: this.billingAddressFormGroup.get('salutation').value,
      firstName: this.billingAddressFormGroup.get('firstName').value,
      lastName: this.billingAddressFormGroup.get('lastName').value,
      streetName: this.billingAddressFormGroup.get('streetName').value,
      streetNumber: this.billingAddressFormGroup.get('streetNumber').value,
      postalCode: this.billingAddressFormGroup.get('postalCode').value,
      city: this.billingAddressFormGroup.get('city').value,
      email: this.billingAddressFormGroup.get('email').value
    };

    // this.log.info('submit(): checkoutBillingAddress = ', checkoutBillingAddress);

    this.loading = true;
    
    const span = this.tracer.startSpan(
      'BillingAddressComponent.submit',
      {
        attributes: {
          'shoppingCartId': window.customer.shoppingCartId
        }
      }
    );
    
    window.frontendModel.billingAddress = checkoutBillingAddress;

    this.addressValidationService.validateAddress({ ...checkoutBillingAddress }, span)
      .subscribe(
        res => {
          this.log.info('validateAddress.subscribe(): res = ', res);

          this.loading = false;

          span.end();

          this.submitted.emit(checkoutBillingAddress);

          this.stepper.next();
        },
        err => {
          this.log.info('validateAddress.subscribe(): err = ', err);

          this.loading = false;

          if (err.error && err.error.invalidField === 'streetName') {
            this.addressValidationResult = 'Der angegebene Straßenname ist ungültig, bitte korrigieren Sie Ihre Eingaben.';
            this.billingAddressFormGroup.get('streetName').setErrors({
              valid: 'Ungültige Eingabe'
            });
          } else if (err.error && err.error.invalidField === 'streetNumber') {
            this.addressValidationResult = 'Die angegebene Hausnummer ist ungültig, bitte korrigieren Sie Ihre Eingaben.';
            this.billingAddressFormGroup.get('streetNumber').setErrors({
              valid: 'Ungültige Eingabe'
            });
          } else if (err.error && err.error.invalidField === 'postalCode') {
            this.addressValidationResult = 'Die angegebene Postleitzahl ist ungültig, bitte korrigieren Sie Ihre Eingaben.';
            this.billingAddressFormGroup.get('postalCode').setErrors({
              valid: 'Ungültige Eingabe'
            });
          } else if (err.error && err.error.invalidField === 'city') {
            this.addressValidationResult = 'Die angegebene Stadt ist ungültig, bitte korrigieren Sie Ihre Eingaben.';
            this.billingAddressFormGroup.get('city').setErrors({
              valid: 'Ungültige Eingabe'
            });
          } else {
            this.addressValidationResult = 'Die angegebene Adresse ist ungültig, bitte korrigieren Sie Ihre Eingaben.';
          }

          err.error = null;
          this.errorHandler.handleError(err, { component: 'BillingAddressComponent', addressValidationResult: this.addressValidationResult });

          span.recordException({ name: 'Validation failed', message: this.addressValidationResult });
          span.end();

          this.billingAddressFormGroup.updateValueAndValidity();
        }
      );

  }
}
