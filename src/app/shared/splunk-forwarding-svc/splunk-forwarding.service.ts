import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { interval, Observable, of } from 'rxjs';
import { takeWhile, retryWhen, delay, take } from 'rxjs/operators';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';

interface SplunkEvent {
  [key: string]: any;
}

/**
* see https://docs.splunk.com/Documentation/Splunk/latest/Data/FormateventsforHTTPEventCollector#Event_metadata
*/
export interface SplunkEntry {
  // The event time. The default time format is epoch time format, in the format <sec>.<ms>. For example, 1433188255.500 indicates 1433188255 seconds and 500 milliseconds after epoch, or Monday, June 1, 2015, at 7:50:55 PM GMT.
  "time"?: number;
  // The host value to assign to the event data. This is typically the hostname of the client from which you're sending data.
  "host"?: string;
  // The source value to assign to the event data. For example, if you're sending data from an app you're developing, you could set this key to the name of the app.
  "source"?: string;
  // The sourcetype value to assign to the event data.
  "sourcetype": string;
  // The name of the index by which the event data is to be indexed. The index you specify here must be within the list of allowed indexes if the token has the indexes parameter set.
  "index"?: string;
  // (Not applicable to raw data.) Specifies a JSON object that contains explicit custom fields to be defined at index time. Requests containing the "fields" property must be sent to the /collector/event endpoint, or they will not be indexed. For more information, see Indexed field extractions.
  "fields"?: any;

  event: SplunkEvent;
}

@Injectable({
  providedIn: 'root'
})
export class SplunkForwardingService {

  private static readonly LOG_ENDPOINT = '/data/log';
  private static readonly LOG_BATCH_ENDPOINT = '/data/log-batch';

  private logServiceUrl: string;
  private logBatchServiceUrl: string;

  private batchProcessRunning: boolean
  private batchQueue: SplunkEntry[];

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.logServiceUrl = config.apiEndpoint + SplunkForwardingService.LOG_ENDPOINT;
    console.log('constructor(): this.logServiceUrl = ', this.logServiceUrl);

    this.logBatchServiceUrl = config.apiEndpoint + SplunkForwardingService.LOG_BATCH_ENDPOINT;
    console.log('constructor(): this.logBatchServiceUrl = ', this.logBatchServiceUrl);

    this.batchProcessRunning = true;
    this.batchQueue = [];

    // check every 5s if there's data to forward
    interval(5000)
      .pipe(takeWhile(() => this.batchProcessRunning))
      .subscribe(() => {
        const batch = this.batchQueue;

        this.batchQueue = [];

        this.sendBatch(batch)
          .pipe(
            // retry 5 times with a delay of 15s
            retryWhen(errors => errors.pipe(delay(15000), take(5)))
          )
          .subscribe();
      });
  }

  /**
   * The entry will be supplemented with the source, the environment, the current path, the shoppingCartId and the logRocketSessionURL
   * 
   * @param entry 
   */
  public forwardEvent(entry: SplunkEntry): void {
    this.forwardEvents([entry]);
  }

  public forwardEvents(entries: SplunkEntry[]): void {
    for(const entry of entries) {
      entry.source = 'frontend';
      entry.event.environment = this.config.environment;
      entry.event.path = window.location.href;

      entry.event.shoppingCartId = window.customer.shoppingCartId;

      entry.event.logRocketSessionURL = window.logrocketData.sessionURL;
      
      // do not use the logger here, or a it'll trigger a recursion
      console.log('SplunkForwardingService.forwardEvent(): adding entry to queue, entry = ', entry);

      this.batchQueue.push(entry);
    }
  }

  private sendBatch(batch: SplunkEntry[]): Observable<void> {
    if(batch.length > 0) {
      console.log('SplunkForwardingService.sendBatch(): sending ' + batch.length + ' entries to batch endpoint');
      
      return this.http.post<void>(this.logBatchServiceUrl, batch);
    }

    // return empty Observable
    return of<void>();
  }
}
