const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const Competition = require('../../lib/model/competition');

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('the competition module', () => {
    var competitions;
    var nrl;
    before((() => {
        competitions = Competition.getAllCompetitions();
    }));
    it('should list all competitions', () => {
        expect(competitions).not.empty();
    });
    it('should locate a competition by code', () => {
        nrl = Competition.getCompetition('nrl');
        expect(nrl).not.null();
        expect(nrl.code).equals('nrl');
    });
});