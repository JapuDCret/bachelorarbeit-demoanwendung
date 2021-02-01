import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { publishReplay, refCount, tap } from 'rxjs/operators';

import { NGXLogger } from 'ngx-logger';

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
    private log: NGXLogger,
    private http: HttpClient,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    this.localizationServiceUrl = config.apiEndpoint + LocalizationService.LOCALIZATION_ENDPOINT;
    this.log.info('constructor(): this.localizationServiceUrl = ', this.localizationServiceUrl);
  }

  public getTranslations(): Observable<Localization> {
    this.log.info('getTranslations(): requesting translations');

    return this.http.get<Localization>(
      this.localizationServiceUrl
    )
      .pipe(
        tap((val) => {
          this.log.info('getTranslations(): returnVal = ', val);
        }),
        publishReplay(1, 2000),
        refCount(),
      );
  }
}
