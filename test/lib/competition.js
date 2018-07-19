const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const dirtyChai = require('dirty-chai');
const Ludus = require('../../lib/ludus');
const Competition = require('../../lib/model/competition');
const NrlCompetition = require('../../lib/competitions/nrl');
const Round = require('../../lib/model/round');
const Team = require('../../lib/model/team');
const Match = require('../../lib/model/match');

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('the competition module', () => {
    /** @type {Competition[]} */
    var competitions;
    /** @type {NrlCompetition} */
    var nrl;
    /** @type {number} */
    var year;
    /** @type {Team[]} */
    var teams;
    /** @type {Round[]} */
    var rounds;
    /** @type {Match[]} */
    var matches;
    before((() => {
        competitions = Ludus.competitions();
        year = new Date().getFullYear();
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
        expect(nrl).is.not.null();
        nrl.clubs(result => {
            teams = result;
            expect(teams).not.empty();
        });
    });
    it('should list all rounds for a competition for a given year', () => {
        expect(nrl).is.not.null();
        return Promise.resolve(nrl.rounds(year))
            .then(result => {
                rounds = result;
                expect(rounds).not.empty();
            });
    });
    it('should list all match results per round for a given year', () => {
        expect(rounds).is.not.empty();
        return Promise.resolve(nrl.results(rounds[0]))
            .then(result => {
                matches = result;
                expect(matches).not.empty();
                matches.forEach(g => {
                    expect(g).is.not.null();
                    expect(g.date).is.not.null();
                    expect(g.date).is.not.NaN();
                    expect(g.date.getFullYear()).eql(rounds[0].year);

                    expect(g.homeTeam).is.not.null();
                    expect(g.homeTeam.nickname).is.not.empty();
                    expect(g.homeTeam.players).is.not.empty();
                    expect(g.homeTeamScore).is.gte(0);

                    expect(g.awayTeam).is.not.null();
                    expect(g.awayTeam.nickname).is.not.empty();
                    expect(g.awayTeam.players).is.not.empty();
                    expect(g.awayTeamScore).is.gte(0);
                });
            });
    });
});