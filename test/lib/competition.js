/*eslint-disable no-unused-vars*/
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const dirtyChai = require('dirty-chai');
const Ludus = require('../../lib/ludus');
const Competition = require('../../lib/model/competition');
const NrlCompetition = require('../../lib/competitions/nrl');
const Round = require('../../lib/model/round');
const Team = require('../../lib/model/team');
const Club = require('../../lib/model/club');
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
    /** @type {Club[]} */
    var clubs;
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
        return Promise.resolve(nrl.clubs())
            .then(result => {
                clubs = result;
                expect(clubs).not.empty();
                clubs.forEach(function(c) {
                    expect(c, 'Club').is.not.null();
                    expect(c.nickname, 'Club Nickname').is.not.empty();
                });
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
                    // Validate match details
                    expect(g, 'Match').is.not.null();
                    expect(g.date, 'Match Date').is.not.null();
                    expect(g.date, 'Match Date').is.not.NaN();
                    expect(g.date.getFullYear(), 'Match Date Year').eql(rounds[0].year);
                    expect(g.date.getHours(), 'Match Game Time').is.gt(0);
                    expect(g.venue, 'Match Venue').is.not.empty();

                    // Validate home and away team details
                    expect(g.homeTeam, 'Home Team').is.not.null();
                    expect(g.homeTeam.club.nickname, 'Home Team Name').is.not.empty();
                    expect(g.awayTeam, 'Away Team').is.not.null();
                    expect(g.awayTeam.club.nickname, 'Away Team Name').is.not.empty();

                    // Validate home and away team score
                    expect(g.homeTeam.score, 'Home Team Score').is.gte(0);
                    expect(g.awayTeam.score, 'Away Team Score').is.gte(0);
                });
            });
    });
    it('should list detailed match results per round for a given year', function(done) {
        //this.timeout(20000);
        //setTimeout(done, 10000);

        expect(matches).is.not.empty();
        return Promise.resolve(nrl.match(rounds[0].year, rounds[0].number, matches[0].homeTeam.club.nickname, matches[0].awayTeam.club.nickname))
            .then(result => {
                const detailedResult = result;
                expect(detailedResult, 'Match').is.not.null();
                expect(detailedResult.date, 'Match Date').is.not.null();
                expect(detailedResult.date, 'Match Date').is.not.NaN();
                expect(detailedResult.date.getFullYear(), 'Match Date Year').eql(rounds[0].year);
                expect(detailedResult.date.getHours(), 'Match Game Time').is.gt(0);
                expect(detailedResult.venue, 'Match Venue').is.not.empty();
                expect(detailedResult.attendance, 'Match Attendance').is.gt(0);

                expect(detailedResult.awayTeam.players, 'Away Team Players').is.not.empty();
                detailedResult.awayTeam.players.forEach(p => {
                    expect(p.firstName, 'Away Team - Player Firstname').is.not.empty();
                    expect(p.lastName, 'Away Team - Player Lastname').is.not.empty();
                    expect(p.playerId, 'Away Team - Player Id').is.not.NaN();
                    expect(p.position, 'Away Team - Player Position').is.not.empty();
                    expect(p.positionNumber, 'Away Team - Player Position Number').is.gt(0);
                    expect(p.matchStats, 'Away Team - Player Match Stats').is.not.null();
                    expect(p.matchStats.minutesPlayed, 'Away Team - Player Match Stats - Mins Played').is.gt(0);
                });

                // expect(detailedResult.homeTeam.players, 'Home Team Players').is.not.empty();
                // detailedResult.homeTeam.players.forEach(p => {
                //     expect(p.firstName, 'Home Team - Player Firstname').is.not.empty();
                //     expect(p.lastName, 'Home Team - Player Lastname').is.not.empty();
                //     expect(p.playerId, 'Home Team - Player Id').is.not.NaN();
                //     expect(p.position, 'Home Team - Player Position').is.not.empty();
                //     expect(p.positionNumber, 'Home Team - Player Position Number').is.gt(0);
                //     expect(p.matchStats, 'Home Team - Player Match Stats').is.not.null();
                //     expect(p.matchStats.minutesPlayed, 'Home Team - Player Match Stats - Mins Played').is.gt(0);
                // });
            });
    });
});