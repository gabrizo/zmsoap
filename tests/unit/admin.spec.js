import chai, { expect } from 'chai';
import { Admin } from '../../src/index.js'
import charAsPromised from 'chai-as-promised';

chai.use(charAsPromised);

const hostname = 'localhost';
const username = 'admin@zimbra.breezy.net';
const password = 'password';
let zimbraAdmin;

describe('Admin', () => {
  describe('Dummy tests', () => {
    it('true should true', () => {
      expect(true).to.be.true;
    });
    it('false should be false', () => {
      expect(false).to.be.false;
    });
  });
  describe('getAuthToken()', () => {
    it('should throw an error hostname undefined', () => {
      const result = Admin.getAuthToken();
      return expect(result).to.rejectedWith('hostname undefined');
    });
    it('should throw an error username undefined', () => {
      const result = Admin.getAuthToken(hostname);
      return expect(result).to.rejectedWith('username undefined');
    });
    it('should throw an error password undefined', () => {
      const result = Admin.getAuthToken(hostname, username);
      return expect(result).to.rejectedWith('password undefined');
    });
    it('should throw error if it cannot make a connection', () => {
      const res = Admin.getAuthToken('dummy-hostname', username, password);
      return expect(res).to.rejected;
    });
    it('it should throw error when credentials are incorrect', () => {
      const res = Admin.getAuthToken(hostname, "dummy-username", password);
      return expect(res).to.rejected;
    });
    it('it should return an authToken', () => {
      const res = Admin.getAuthToken(hostname, username, password);
      return expect(res).to.eventually.be.a('string');
    });
  });

  describe('instance methods', () => {
    before((done) => {
      let authToken;
      Admin.getAuthToken(hostname, username, password)
      .then((authToken) => {
        zimbraAdmin = new Admin(hostname, authToken);
        done();
      });
      //handle reject here
    });

    it('zimbraAdmin should be an instance of Admin', () => {
      expect(zimbraAdmin).to.be.an.instanceof(Admin);
    });

    describe('getDomain', () => {
      it('should return a domain object', () => {
        const res = zimbraAdmin.getDomain(username.split("@")[1]);
        return expect(res).to.eventually.be.a('object');
      });
      it('should throw error if the domain does not exist', () => {
        const res = zimbraAdmin.getDomain('dummy-domain.net');
        return expect(res).to.rejected;
      })
    });//getDomain

    describe('createDomain', () => {
      it('should throw undefined when domain is not provided', () => {
        const res = zimbraAdmin.createDomain();

        return expect(res).to.rejectedWith('domain undefined');
      });
      it('should create a new domain', () => {
        const res = zimbraAdmin.createDomain("gabrizo.example.com");
        return expect(res).to.eventually.be.a('object');
      });
      it('should take an object domain attributes', () => {
        const domainAttrs = {
          description: "Super Domain",
          "zimbraNotes": "Some notes about the domain"
        };
        const res = zimbraAdmin.createDomain("zmsoap.example.com", domainAttrs);
        return expect(res).to.eventually.be.a('object');
      });
    }); //createDomain

    describe('modifyDomain()', () => {
      it('should update the domain', () => {
        const domainAttrs = {
          zimbraNotes: `updated at - ${new Date()}`,
          description: `description - ${new Date()}`
        }
        const res = zimbraAdmin.modifyDomain(username.split("@")[1], domainAttrs);
        return expect(res).to.eventually.be.a('object');
      });
      it('should rejected if domain does not exist', () => {
        const domainAttrs = {
          zimbraNotes: `updated at - ${new Date()}`,
          description: `description - ${new Date()}`
        }
        const res = zimbraAdmin.modifyDomain("bad-domain.com", domainAttrs);
        return expect(res).to.rejected;
      });
    }); //modifyDomain

    describe('deleteDomain', () => {
      it('should delete the domain', () => {
        const response = { _jsns: 'urn:zimbraAdmin' };
        const res = zimbraAdmin.deleteDomain('zmsoap.example.com');
        return expect(res).to.eventually.deep.equal(response);
      })
      it('should delete the domain because our tests have created it', () => {
        const response = { _jsns: 'urn:zimbraAdmin' };
        const res = zimbraAdmin.deleteDomain('gabrizo.example.com');
        return expect(res).to.eventually.deep.equal(response);
      });
      it('should be rejected if the domain does not exist', () => {
        const res = zimbraAdmin.deleteDomain('dummy-domain-delete.com');
        return expect(res).to.be.rejected;
      })
    }); //deleteDomain


  });
});


// t
