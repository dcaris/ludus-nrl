/*eslint-disable no-unused-vars*/
const Club = require('./club');

class Match {
    /**
     * Creates an instance of Match.
     * @param {number} id
     * @param {Date} date
     * @param {string} venue
     * @param {number} attendance
     * @param {Club} homeTeam
     * @param {number} homeTeamScore
     * @param {Club} awayTeam
     * @param {number} awayTeamScore
     * @memberof Match
     */
    constructor(id, date, venue, attendance, homeTeam, homeTeamScore, awayTeam, awayTeamScore) {
        /** @type {number} */
        this.id = id;
        /** @type {Date} */
        this.date = date;
        /** @type {string} */
        this.venue = venue;
        /** @type {number} */
        this.attendance = attendance;
        /** @type {Club} */
        this.homeTeam = homeTeam;
        /** @type {number} */
        this.homeTeamScore = homeTeamScore;
        /** @type {Club} */
        this.awayTeam = awayTeam;
        /** @type {number} */
        this.awayTeamScore = awayTeamScore;
    }
}

module.exports = Match;