import { Injectable } from "@angular/core";

import { NGXLogger, NGXLoggerMonitor, NGXLogInterface } from "ngx-logger";

import { SplunkForwardingService } from "src/app/splunk-forwarding-svc/splunk-forwarding.service";

@Injectable({
    providedIn: 'root',
})
export class SplunkLoggingMonitor extends NGXLoggerMonitor {
    constructor(
        private log: NGXLogger,
        private splunk: SplunkForwardingService
    ) {
        super();
    }

    onLog(logObject: NGXLogInterface): void {
        const printableParams = this.makeParamsPrintable(logObject.additional);

        const logEvent = {
            sourcetype: 'log',
            event: {
                severity: logObject.level,
                message: logObject.message,
                ...printableParams,
                fileName: logObject.fileName,
                lineNumber: logObject.lineNumber,
                timestamp: logObject.timestamp
            }
        };

        this.splunk.forwardEvent(logEvent);
    }

    private makeParamsPrintable(optionalParams: any[]): { [key: string]: string } {
        const printableParams = {};

        // do not use the logger here, or a it'll trigger a recursion
        console.log('makeParamsPrintable(): optionalParams = ', optionalParams);

        if(Array.isArray(optionalParams)) {
            for(let i = 0; i < optionalParams.length; i++) {
                printableParams['param' + i] = this.getJsonValueSafe(optionalParams[i]);
            }
        } else {
            printableParams['param0'] = this.getJsonValueSafe(optionalParams);
        }

        return printableParams;
    }

    private getJsonValueSafe(value: any) {
        let jsonValue = '<non-stringifiable>';

        try {
            jsonValue = JSON.stringify(value);
        } catch(e) {/* ignore */}

        return jsonValue;
    }
}
