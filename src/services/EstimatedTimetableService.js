import SiriService from "./SiriService";
import * as Xml from "./Xml";

export class EstimatedTimetableService extends SiriService {

    get(options) {
        let doc = this.getDocument(options);
        return this.fetch(doc);
    }

    getDocument(options) {
        let now = new Date();
        let doc = Xml.createSoapDocument();
        let body = Xml.createElement(doc.documentElement, "soap:Body");
        let service = Xml.createElement(body, "tns:GetEstimatedTimetable", null,
            {
                "xmlns:siri": Xml.SIRI_NAMESPACE_URI,
                "xmlns:acsb": Xml.ACSB_NAMESPACE_URI,
                "xmlns:ifopt": Xml.IFOPT_NAMESPACE_URI,
                "xmlns:datex": Xml.DATEX_NAMESPACE_URI,
                "xmlns:tns": Xml.TNS_NAMESPACE_URI
            });

        // RequestInfo
        let serviceRequestInfo = Xml.createElement(service, "ServiceRequestInfo");
        Xml.createElement(serviceRequestInfo, "siri:RequestTimestamp", now.toISOString());
        if (options["requestorRef"]) {
            Xml.createElement(serviceRequestInfo, "siri:RequestorRef", options["requestorRef"]);
        }
        let messageIdentifier = (options["messageIdentifier"]) ? options["messageIdentifier"] : now.getTime();
        Xml.createElement(serviceRequestInfo, "siri:MessageIdentifier", messageIdentifier);

        // Request
        let request = Xml.createElement(service, "Request", null, { "version": options["version"] });
        Xml.createElement(request, "siri:RequestTimestamp", now.toISOString());
        Xml.createElement(request, "siri:MessageIdentifier", messageIdentifier);

        if (options["lineRef"]) {
            let lines = Xml.createElement(request, "Lines");
            let lineDirection = Xml.createElement(lines, "LineDirection");
            Xml.createElement(lineDirection, "siri:LineRef", options["lineRef"]);
        }

        if (options["previewInterval"]) {
            Xml.createElement(request, "siri:PreviewInterval", "PT" + options["previewInterval"] + "M");
        }

        // Request Extension
        Xml.createElement(service, "RequestExtension");

        return doc;
    }

}

const service = new EstimatedTimetableService();

export default service;