import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import * as LogRocket from 'logrocket';

import { AppConfig, APP_CONFIG } from 'src/app/app-config-module';

@Component({
  selector: 'app-record-consent-dialog',
  templateUrl: './record-consent-dialog.component.html',
  styleUrls: ['./record-consent-dialog.component.css']
})
export class RecordConsentDialogComponent implements OnInit {

  loading: boolean = false;
  sessionRecordingAlreadyActive: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RecordConsentDialogComponent>,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    console.log('RecordConsentDialogComponent.constructor(): hello');
  }

  ngOnInit(): void {
    console.log('RecordConsentDialogComponent.ngOnInit(): initializing..');

    this.sessionRecordingAlreadyActive = window.logrocketData.sessionURL != 'n/a';

    console.log('RecordConsentDialogComponent.ngOnInit(): initialized!');
  }

  closeDialog() {
    this.dialogRef.close(window.logrocketData.sessionURL);
  }

  activateLogRocket() {
    this.loading = true;

    // initialize session recording
    LogRocket.init(this.config.logRocketAppId, {});

    // start a new session
    LogRocket.startNewSession();

    // pass unique "session"-id to LogRocket
    LogRocket.identify(window.customer.shoppingCartId);

    // make sessionURL accessable
    LogRocket.getSessionURL((sessionURL) => {
      window.logrocketData.sessionURL = sessionURL;
      
      this.loading = false;

      this.dialogRef.close(sessionURL);
    });
  }
}
