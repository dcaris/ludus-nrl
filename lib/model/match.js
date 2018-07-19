const Team = require('./team');

class Match {
    /**
     * 
     * @param {Date} date 
     * @param {string} venue
     * @param {Team} homeTeam 
     * @param {Team} awayTeam 
     */
    constructor(date, venue, homeTeam, awayTeam) {
        /** @type {Date} */
        this.date = date;
        /** @type {string} */
        this.venue = venue;
        /** @type {Team} */
        this.homeTeam = homeTeam;
        /** @type {Team} */
        this.awayTeam = awayTeam;
    }
}

module.exports = Match;