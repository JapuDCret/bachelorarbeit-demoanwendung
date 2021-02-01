import { Component, Inject } from '@angular/core';

import { NGXLogger } from 'ngx-logger';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';
import { SplunkLoggingMonitor } from 'src/app/splunk-logging-monitor/splunk-logging-monitor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bachelorarbeit-demoanwendung';

  constructor(
    private log: NGXLogger,
    private splunkMonitor: SplunkLoggingMonitor,
    @Inject(APP_CONFIG) config: AppConfig
  ) {
    log.registerMonitor(splunkMonitor);
  }
}
