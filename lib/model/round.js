class Round {

    /**
     * Creates an instance of Round.
     * @param {number} year
     * @param {number} round
     * @param {string} name
     * @memberof Round
     */
    constructor(year, round, name) {
        this.year = year;
        this.round = round;
        this.name = name;
    }
}

module.exports = Round;