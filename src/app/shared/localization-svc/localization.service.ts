import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';

export interface Localization {
  "de": {
    [translationKey: string]: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private static readonly LOCALIZATION_ENDPOINT = '/data/translation';

  readonly localizationServiceUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    console.log('constructor(): config.apiEndpoint = ', config.apiEndpoint);

    this.localizationServiceUrl = config.apiEndpoint + LocalizationService.LOCALIZATION_ENDPOINT;
    console.log('constructor(): this.localizationServiceUrl = ', this.localizationServiceUrl);
  }

  public getTranslations(): Observable<Localization> {
    console.log('getTranslations(): requesting translations');

    return this.http.get<Localization>(
      this.localizationServiceUrl
    )
    .pipe(
      tap((val) => {
        console.log('getTranslations(): returnVal = ', val);
      })
    );
  }
}
