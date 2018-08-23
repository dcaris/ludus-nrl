/*eslint-disable no-unused-vars*/
const Team = require('./team');
const PlayerStats = require('./playerStats');

class Match {
    /**
     * 
     * @param {number} id 
     * @param {Date} date 
     * @param {string} venue
     * @param {Team} homeTeam 
     * @param {Team} awayTeam 
     * @param {PlayerStats[]} playerStats 
     */
    constructor(id, date, venue, attendance, homeTeam, awayTeam, playerStats) {
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
        /** @type {PlayerStats[]} */
        this.playerStats = playerStats || [];
    }
}

module.exports = Match;