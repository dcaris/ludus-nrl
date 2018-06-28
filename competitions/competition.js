const glob = require('glob');
const path = require('path');

class competition {
    /**
     * Creates an instance of competition.
     * @param {*} name
     * @param {*} code
     * @param {*} location
     * @param {*} url
     * @memberof competition
     */
    constructor(name, code, location, url) {
        this.name = name;
        this.code = code;
        this.url = url;
        this.location = location;
    }

    /**
     * Returns all competitions available to query
     *
     * @static
     * @returns
     * @memberof competition
     */
    static getAllCompetitions() {
        var competitions = [];
        glob.sync('competitions/*.js').forEach((file) => {
            if (!file.endsWith('competition.js')) {
                var comp = require(path.resolve(file));
                competitions.push(new comp());
            }
        });

        return competitions;
    }
}

module.exports = competition;