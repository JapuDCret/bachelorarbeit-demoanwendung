import { ErrorHandler, Injectable, Injector } from "@angular/core";

import { SplunkEntry, SplunkForwardingService } from "src/app/shared/splunk-forwarding-svc/splunk-forwarding.service";

@Injectable({
    providedIn: 'root'
})
export class SplunkForwardingErrorHandler extends ErrorHandler {
    private splunkForwarding: SplunkForwardingService;

    constructor(injector: Injector) {
        super();

        this.splunkForwarding = injector.get(SplunkForwardingService);
    }

    handleError(error, optionalData?: any): void {
        console.log('SplunkForwardingErrorHandler.handleError(): error = ', error);

        const mappedError = error.originalError || error.error || error;
        console.log('SplunkForwardingErrorHandler.handleError(): mappedError = ', mappedError);

        if (mappedError == null) {
            console.log('SplunkForwardingErrorHandler.handleError(): mappedError is null or undefined, skipping..');
            return;
        }

        const entry: SplunkEntry = {
            sourcetype: 'error',
            event: {
                ...optionalData,
                frontendModel: window.frontendModel,
                // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
                name: mappedError.name,
                message: mappedError.message,
                stack: mappedError.stack,
                fileName: mappedError.fileName,// non-standard
                lineNumber: mappedError.lineNumber,// non-standard
                columnNumber: mappedError.columnNumber// non-standard
            }
        };

        this.splunkForwarding.forwardEvent(entry);
    }
}