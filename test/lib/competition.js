const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const Ludus = require('../../lib/ludus');

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('the competition module', () => {
    var competitions;
    var nrl;
    before((() => {
        competitions = Ludus.competitions();
    }));
    it('should list all competitions', () => {
        expect(competitions).not.empty();
    });
    it('should locate a competition by code', () => {
        nrl = Ludus.competition('nrl');
        expect(nrl).not.null();
        expect(nrl.code).equals('nrl');
    });
    it('should list all clubs for a competition', () => {
        var teams = [];
        nrl.clubs(result => {
            teams = result;
            expect(teams).not.empty();
        });
    });
    it('should list all rounds for a competition for a given year', () => {
        var rounds = [];
        return Promise.resolve(nrl.rounds(new Date().getFullYear()))
            .then(result => {
                rounds = result;
                expect(rounds).not.empty();
            })
            .catch((error) => { throw new Error('was not supposed to fail'); });
    });
});