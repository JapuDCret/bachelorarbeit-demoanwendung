import { Component } from '@angular/core';

import { NGXLogger } from 'ngx-logger';

import { SplunkLoggingMonitor } from './splunk-logging-monitor/splunk-logging-monitor';

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
  ) {
    log.registerMonitor(splunkMonitor);
  }
}
