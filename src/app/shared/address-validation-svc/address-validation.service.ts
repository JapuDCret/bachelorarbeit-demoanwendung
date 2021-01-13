import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';

export interface Address {
  streetName: string;
  streetNumber: number;
  postalCode: number;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressValidationService {

  private static readonly ADDRESSVALIDATION_ENDPOINT = '/data/address-validation';

  readonly addressValidationServiceUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    console.log('constructor(): config.apiEndpoint = ', config.apiEndpoint);

    this.addressValidationServiceUrl = config.apiEndpoint + AddressValidationService.ADDRESSVALIDATION_ENDPOINT;
    console.log('constructor(): this.addressValidationServiceUrl = ', this.addressValidationServiceUrl);
  }

  public validateAddress(address: Address): Observable<void> {
    console.log('validateAddress(): validating address, data = ', address);

    return this.http.post<void>(
      this.addressValidationServiceUrl,
      address
    )
      .pipe(
        tap((val) => {
          console.log('validateAddress(): returnVal = ', val);
        })
      );
  }
}
