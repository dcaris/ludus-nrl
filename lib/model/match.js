const Team = require('./team');

class Match {
    /**
     * 
     * @param {number} id 
     * @param {Date} date 
     * @param {string} venue
     * @param {Team} homeTeam 
     * @param {Team} awayTeam 
     */
    constructor(id, date, venue, attendance, homeTeam, awayTeam) {
        /** @type {number} */
        this.id = id;
        /** @type {Date} */
        this.date = date;
        /** @type {string} */
        this.venue = venue;
        /** @type {number} */
        this.attendance = attendance;
        /** @type {Team} */
        this.homeTeam = homeTeam;
        /** @type {Team} */
        this.awayTeam = awayTeam;
    }
}

module.exports = Match;