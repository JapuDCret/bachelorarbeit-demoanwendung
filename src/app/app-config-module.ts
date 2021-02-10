import { InjectionToken, NgModule } from "@angular/core";

import { environment } from "src/environments/environment";

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  environment: string;
  apiEndpoint: string;
}

export const APP_DI_CONFIG: AppConfig = {
  environment: environment.environment,
  apiEndpoint: environment.apiEndpoint
}

@NgModule({
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule { }