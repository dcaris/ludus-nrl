class Player {

    /**
     * 
     * @param {number} playerId 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} position 
     * @param {number} positionNumber 
     */
    constructor(playerId, firstName, lastName, position, positionNumber) {
        this.playerId = playerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.position = position;
        this.positionNumber = positionNumber;
    }
}

module.exports = Player;