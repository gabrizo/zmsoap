import chai, { expect } from 'chai';
import { Admin } from '../../src/index.js'
import charAsPromised from 'chai-as-promised';

chai.use(charAsPromised);

const hostname = 'localhost';
const username = 'admin@zimbra.breezy.net';
const password = 'password';

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
  })
});
