import SiriService from "./SiriService";
import * as Xml from "./Xml";

export class StopPointsDiscoveryService extends SiriService {

    get(options) {
        let doc = this.getDocument(options);
        return this.fetch(doc);
    }

    getDocument(options) {
        let now = new Date();
        let doc = Xml.createSoapDocument();
        let body = Xml.createElement(doc.documentElement, 'soap:Body');

        let service = Xml.createElement(body, 'tns:StopPointsDiscovery', null,
            {
                "xmlns:siri": Xml.SIRI_NAMESPACE_URI,
                "xmlns:acsb": Xml.ACSB_NAMESPACE_URI,
                "xmlns:ifopt": Xml.IFOPT_NAMESPACE_URI,
                "xmlns:datex": Xml.DATEX_NAMESPACE_URI,
                "xmlns:tns": Xml.TNS_NAMESPACE_URI
            });

        let request = Xml.createElement(service, 'Request', null, {
            "version": options['version']
        });
        Xml.createElement(request, 'siri:RequestTimestamp', now.toISOString());
        Xml.createElement(request, 'siri:RequestorRef', options['requestorRef']);
        Xml.createElement(request, 'siri:MessageIdentifier', now.getTime());

        Xml.createElement(service, 'RequestExtension');
        return doc;
    }
}

const service = new StopPointsDiscoveryService();

export default service;