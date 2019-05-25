import SiriService from "./SiriService";
import * as Xml from "./Xml";

export class StopMonitoringService extends SiriService {

    get(options) {
        let doc = this.getDocument(options);
        return this.fetch(doc);
    }

    getDocument(options) {
        let now = new Date();
        let doc = Xml.createSoapDocument();
        let body = Xml.createElement(doc.documentElement, 'soap:Body');
        let service = Xml.createElement(body, 'tns:GetStopMonitoring', null,
            {
                "xmlns:siri": Xml.SIRI_NAMESPACE_URI,
                "xmlns:acsb": Xml.ACSB_NAMESPACE_URI,
                "xmlns:ifopt": Xml.IFOPT_NAMESPACE_URI,
                "xmlns:datex": Xml.DATEX_NAMESPACE_URI,
                "xmlns:tns": Xml.TNS_NAMESPACE_URI
            });

        // RequestInfo
        let serviceRequestInfo = Xml.createElement(service, 'ServiceRequestInfo');
        Xml.createElement(serviceRequestInfo, 'siri:RequestTimestamp', now.toISOString());
        if (options['requestorRef']) {
            Xml.createElement(serviceRequestInfo, 'siri:RequestorRef', options['requestorRef']);
        }
        let messageIdentifier = (options['messageIdentifier']) ? options['messageIdentifier'] : now.getTime();
        Xml.createElement(serviceRequestInfo, 'siri:MessageIdentifier', messageIdentifier);

        // Request
        let request = Xml.createElement(service, 'Request', null, { "version": options['version'] });
        Xml.createElement(request, 'siri:RequestTimestamp', now.toISOString());
        Xml.createElement(request, 'siri:MessageIdentifier', messageIdentifier);

        if (options['monitoringRef']) {
            Xml.createElement(request, 'siri:MonitoringRef', options['monitoringRef']);
        }
        if (options['lineRef']) {
            Xml.createElement(request, 'siri:LineRef', options['lineRef']);
        }
        if (options['startTime']) {
            Xml.createElement(request, 'siri:StartTime', options['startTime']);
        }
        if (options['stopVisitTypes']) {
            Xml.createElement(request, 'siri:StopVisitTypes', options['stopVisitTypes']);
        }
        if (options['previewInterval']) {
            Xml.createElement(request, 'siri:PreviewInterval', 'PT' + options['previewInterval'] + 'M');
        }
        if (options['maximumStopVisits']) {
            Xml.createElement(request, 'siri:MaximumStopVisits', options['maximumStopVisits']);
        }
        if (options['minimumStopVisitsPerLine']) {
            Xml.createElement(request, 'siri:MinimumStopVisitsPerLine', options['minimumStopVisitsPerLine']);
        }
        if (options['minimumStopVisitsPerLineVia']) {
            Xml.createElement(request, 'siri:MinimumStopVisitsPerLineVia', options['minimumStopVisitsPerLineVia']);
        }
        if (options['maximumNumberOfCallsOnwards'] || options['maximumNumberOfCallsPrevious']) {
            let maximumNumberOfCalls = Xml.createElement(request, 'siri:MaximumNumberOfCalls', null);
            if (options['maximumNumberOfCallsOnwards']) {
                Xml.createElement(maximumNumberOfCalls, 'siri:Onwards', options['maximumNumberOfCallsOnwards']);
            }
            if (options['maximumNumberOfCallsPrevious']) {
                Xml.createElement(maximumNumberOfCalls, 'siri:Previous', options['maximumNumberOfCallsPrevious']);
            }
        }
        // Request Extension
        Xml.createElement(service, 'RequestExtension');

        return doc;
    }
}

const service = new StopMonitoringService();

export default service;
