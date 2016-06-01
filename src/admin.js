import { soapEnvelope } from './helpers';
import rp from 'request-promise';

export default class Admin {

  static getAuthToken(hostname, username, password) {
    return new Promise((resolve, reject) => {
      if(hostname === undefined) {
        reject(new Error('hostname undefined'))
      }
      if(username === undefined) {
        reject(new Error('username undefined'))
      }
      if(password === undefined) {
        reject(new Error('password undefined'))
      }

      const requestObject = {
        "AuthRequest": {
          "@": {
            "xmlns": "urn:zimbraAdmin"
          },
          'name': username,
          'password': password
        }
      }
      const body = soapEnvelope(requestObject, "");
      const uri = `https://${hostname}:7071/service/admin/soap`;

      rp({
        method: "POST",
        uri: uri,
        body: body,
        strictSSL: false,
        jar: false,
        timeout: 10000
      }).then((body) => {
        // console.log(res);
        let jsonBody = JSON.parse(body);
        resolve(jsonBody.Body.AuthResponse.authToken[0]._content);
      })
      .catch((err) => {
        reject(new Error(err));
      })
    })
  }
}
