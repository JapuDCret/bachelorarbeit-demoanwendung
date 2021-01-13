import { InjectionToken, NgModule } from "@angular/core";

import { environment } from "src/environments/environment";

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  addressValidation: {
    apiEndpoint: string;
  };
  backend4frontend: {
    apiEndpoint: string;
  };
}

export const APP_DI_CONFIG: AppConfig = {
  addressValidation: environment.addressValidation,
  backend4frontend: environment.backend4frontend,
}

@NgModule({
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule { }