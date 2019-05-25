import * as xmldom from "xmldom";

export const SOAP_NAMESPACE_URI = "http://schemas.xmlsoap.org/soap/envelope/";
export const XSD_NAMESPACE_URI = "http://www.w3.org/2001/XMLSchema";
export const XSI_NAMESPACE_URI = "http://www.w3.org/2001/XMLSchema-instance";
export const SIRI_NAMESPACE_URI = "http://www.siri.org.uk/siri";
export const ACSB_NAMESPACE_URI = "http://www.ifopt.org.uk/acsb";
export const IFOPT_NAMESPACE_URI = "http://www.ifopt.org.uk/ifopt";
export const DATEX_NAMESPACE_URI = "http://datex2.eu/schema/2_0RC1/2_0";
export const TNS_NAMESPACE_URI = "http://wsdl.siri.org.uk";

export function createDocument(namespaceUri, qualifiedName) {
    let result = new xmldom.DOMImplementation().createDocument(namespaceUri || "", qualifiedName || "", null);
    let pi = result.createProcessingInstruction("xml", 'version="1.0"');
    result.insertBefore(pi, result.firstChild);
    return result;
}

export function createSoapDocument() {
    let result = createDocument(SOAP_NAMESPACE_URI, "soap:Envelope");
    let element = result.documentElement;
    element.setAttribute("xmlns:xsd", XSD_NAMESPACE_URI);
    element.setAttribute("xmlns:xsi", XSI_NAMESPACE_URI);
    return result;
}

export function createElement(parent, name, value, attributes) {
    let document = parent.ownerDocument;
    let result = document.createElement(name);
    parent.appendChild(result);
    if (value) {
        let text = document.createTextNode(value);
        result.appendChild(text);
    }
    if (attributes) {
        for (let key in attributes) {
            result.setAttribute(key, attributes[key]);
        }
    }
    return result;
}

export function fromString(text) {
    let parser = new xmldom.DOMParser();
    let result = parser.parseFromString(text, "text/xml");
    return result;
}

export function toString(doc) {
    let serializer = new xmldom.XMLSerializer();
    return serializer.serializeToString(doc);
}