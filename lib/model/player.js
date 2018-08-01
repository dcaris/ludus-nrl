/*eslint-disable no-unused-vars*/
const PlayerStats = require('./playerStats');

class Player {

    /**
     * 
     * @param {number} playerId 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} position 
     * @param {number} positionNumber 
     * @param {PlayerStats} matchStats
     */
    constructor(playerId, firstName, lastName, position, positionNumber, matchStats) {
        this.playerId = playerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.position = position;
        this.positionNumber = positionNumber;
        this.matchStats = matchStats || new PlayerStats();
    }
}

module.exports = Player;