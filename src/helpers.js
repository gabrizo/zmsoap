import js2xmlparser from 'js2xmlparser';

export function soapEnvelope(requestObject, authToken) {
  const soapRequest = {
    "@": {
      "xmlns:soap":"http://www.w3.org/2003/05/soap-envelope"
    },
    "soap:Header": {
      "context": {
        "@": {
          "xmlns":"urn:zimbra"
        },
        "authToken": authToken,
        "userAgent": {
          "@": {
            "name": "gabrizo/zmsoap"
          }
        },
        "nosession": "",
        "format": {
          "@": {
            "xmlns": "",
            "type": "js"
          }
        }
      }
    },
    "soap:Body": requestObject
  };
  return js2xmlparser("soap:Envelope", soapRequest);
}
