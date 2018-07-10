const glob = require('glob');
const path = require('path');

class Competition {
    /**
     * Creates an instance of competition.
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
     * Retrieves list of teams for competition
     *
     * @param {(teams: Team[]) => void} callback
     * @memberof Competition
     */
    getTeams(callback) {

    }

    /**
     * Retrieves the team detail
     *
     * @param {string} name
     * @param {(team: Team) => void} callback
     * @memberof Competition
     */
    getTeam(name, callback) {
        this.getTeams(teams => {
            var foundTeam = teams.find(t => t.fullnme == name);
            if (foundTeam) {
                callback(foundTeam);
            }
        });
    }

    /**
     *
     *
     * @param {number} round
     * @param {number} year
     * @param {*} callback
     * @memberof Competition
     */
    getRoundSummary(round, year, callback) {

    }

    /**
     * Returns all competitions available to query
     *
     * @static
     * @returns Competition[]
     * @memberof Competition
     */
    static getAllCompetitions() {
        var competitions = [];
        glob.sync('lib/model/competitions/*.js').forEach((file) => {
            if (!file.endsWith('competition.js')) {
                var comp = require(path.resolve(file));
                competitions.push(new comp());
            }
        });

        return competitions;
    }

    /**
     * Returns a new competition object using the provided competition code
     *
     * @static
     * @param {*} code The competition code
     * @returns {Competition}
     * @memberof Competition
     */
    static getCompetition(code) {
        var result = null;
        glob.sync('lib/model/competitions/*.js').forEach((file) => {
            if (!file.endsWith('competition.js') && file.endsWith(`${code}.js`)) {
                var comp = require(path.resolve(file));
                result = new comp();
            }
        });

        return result;
    }
}

module.exports = Competition;