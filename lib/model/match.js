const Team = require('./team');

class Match {
    /**
     * 
     * @param {Date} date 
     * @param {Team} homeTeam 
     * @param {Team} awayTeam 
     */
    constructor(date, homeTeam, awayTeam) {
        /** @type {Date} */
        this.date = date;
        /** @type {Team} */
        this.homeTeam = homeTeam;
        /** @type {Team} */
        this.awayTeam = awayTeam;
    }
}

module.exports = Match;