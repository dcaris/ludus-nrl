const Team = require('./team');

class Match {
    /**
     * 
     * @param {Date} date 
     * @param {Team} homeTeam 
     */
    constructor(date, homeTeam) {
        /** @type {Date} */
        this.date = date;
        /** @type {Team} */
        this.homeTeam = homeTeam;
    }
}

module.exports = Match;