import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

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
    private log: NGXLogger,
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.log.info('constructor(): config.apiEndpoint = ', config.apiEndpoint);

    this.addressValidationServiceUrl = config.apiEndpoint + AddressValidationService.ADDRESSVALIDATION_ENDPOINT;
    this.log.info('constructor(): this.addressValidationServiceUrl = ', this.addressValidationServiceUrl);
  }

  public validateAddress(address: Address): Observable<void> {
    this.log.info('validateAddress(): validating address, data = ', address);

    return this.http.post<void>(
      this.addressValidationServiceUrl,
      address
    )
      .pipe(
        tap((val) => {
          this.log.info('validateAddress(): returnVal = ', val);
        })
      );
  }
}
