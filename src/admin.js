import { soapEnvelope, zimbraRequest } from './helpers';
import rp from 'request-promise';

export default class Admin {

  constructor(hostname, authToken) {
    this.uri = `https://${hostname}:7071/service/admin/soap`;;
    this.authToken = authToken;
  }

  getDomain(domain) {
    return new Promise((resolve, reject) => {
      const getDomainObj = {
        "GetDomainRequest": {
          "@": { 'xmlns': 'urn:zimbraAdmin' },
          domain: { "@": { "by": "name", }, "#": domain }
        }
      };
      const body = soapEnvelope(getDomainObj, this.authToken);
      zimbraRequest(body, this.uri, 'GetDomainResponse')
      .then((result) => resolve(result))
      .catch((error) => reject(error))
    })
  }

  deleteDomain(domain) {
    return new Promise((resolve, reject) => {
      this.getDomain(domain)
      .then((domain) => {
        const id = domain.domain[0].id;
        const deleteDomainObj = {
          "DeleteDomainRequest": {
            "@": { 'xmlns': 'urn:zimbraAdmin', "id": id },
          }
        };
        const body = soapEnvelope(deleteDomainObj, this.authToken);
        zimbraRequest(body, this.uri, 'DeleteDomainResponse')
        .then((result) => {
          resolve(result)
        })
        // .catch((error) => reject(error))
      })
      .catch((error) => reject(error))


    })
  }

  createDomain(domain, domainAttrs) {
    return new Promise((resolve, reject) => {
      if(domain === undefined) {
        reject(new Error('domain undefined'));
      }
      const requestObject = {
        'CreateDomainRequest': {
          '@': { 'xmlns': 'urn:zimbraAdmin' },
          'name': domain
        }
      };
      if(domainAttrs !== undefined) {
        requestObject.CreateDomainRequest['a'] = [];
        for(let attr in domainAttrs) {
          requestObject.CreateDomainRequest['a'].push({
            "@": { "n": attr },
            "#": domainAttrs[attr]
          })
        }
      }
      const body = soapEnvelope(requestObject, this.authToken);
      zimbraRequest(body, this.uri, 'CreateDomainResponse')
      .then((result) => resolve(result))
      .catch((error) => reject(error))
    });
  }

  modifyDomain(domain, domainAttrs) {
    return new Promise((resolve, reject) => {
      this.getDomain(domain)
      .then((domain) => {
        const id = domain.domain[0].id;
        const requestObject = {
          'ModifyDomainRequest': {
            '@': { 'xmlns': 'urn:zimbraAdmin' },
            'id': id
          }
        };
        if(domainAttrs !== undefined) {
          requestObject.ModifyDomainRequest['a'] = [];
          for(let attr in domainAttrs) {
            requestObject.ModifyDomainRequest['a'].push({
              "@": { "n": attr },
              "#": domainAttrs[attr]
            })
          }
        }
        const body = soapEnvelope(requestObject, this.authToken);
        zimbraRequest(body, this.uri, 'ModifyDomainResponse')
        .then((result) => resolve(result))
        // .catch((error) => reject(error))
      })
    .catch((err) => reject(err))
    });
  }


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
        'AuthRequest': {
          '@': { 'xmlns': 'urn:zimbraAdmin' },
          'name': username,
          'password': password
        }
      };
      const body = soapEnvelope(requestObject, '');
      const uri = `https://${hostname}:7071/service/admin/soap`;
      zimbraRequest(body, uri, 'AuthResponse')
      .then((result) => resolve(result.authToken[0]._content))
      .catch((error) => reject(error))
    })
  }
}
