import js2xmlparser from 'js2xmlparser';
import rp from 'request-promise';

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


export function zimbraRequest(body, uri, responseName) {
  return new Promise((resolve, reject) => {
    rp({
      method: 'POST',
      uri: uri,
      body: body,
      strictSSL: false,
      jar: false,
      timeout: 10000
    }).then((body) => {
      let jsonBody = JSON.parse(body);
      const result = jsonBody.Body[responseName];
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    })
  })
}
