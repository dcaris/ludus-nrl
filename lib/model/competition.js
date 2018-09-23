/*eslint-disable no-unused-vars*/

class Competition {
    /**
     * Creates an instance of competition.
     * 
     * @param {*} name
     * @param {*} code
     * @param {*} location
     * @param {*} url
     * @memberof Competition
     */
    constructor(name, code, location, url) {
        this.name = name;
        this.code = code;
        this.url = url;
        this.location = location;
    }

    /**
     * Returns list of teams for competition 
     * 
     * @returns {Promise<Club[]>}
     */
    async clubs() {
        return [];
    }

    /**
     * Retrieves all the rounds for a given year
     *
     * @param {number} year
     * @returns {Promise<Round[]>}
     * @memberof NrlCompetition
     */
    async rounds(year) {
        return [];
    }

    /**
     * Returns results for a given round
     * 
     * @param {number} year
     * @param {number} round 
     * @returns {Promise<Match>}
     */
    async results(year, round) {

    }

    /**
     * Returns detailed match statistic
     *
     * @param {*} year
     * @param {*} round
     * @param {*} homeTeamNickname
     * @param {*} awayTeamNickname
     * @returns {Promise<Match>}
     * @memberof Competition
     */
    async match(year, round, homeTeamNickname, awayTeamNickname) {

    }

    /**
     * Returns detailed match player statistic
     *
     * @param {*} year
     * @param {*} round
     * @param {*} homeTeamNickname
     * @param {*} awayTeamNickname
     * @returns {Promise<Match>}
     * @memberof Competition
     */
    async matchStatistics(year, round, homeTeamNickname, awayTeamNickname) {

    }

}

module.exports = Competition;