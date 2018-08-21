/*eslint-disable no-unused-vars*/
const glob = require('glob');
const path = require('path');
const Competition = require('./model/competition');


/**
 * Returns all competitions available to query
 *
 * @returns Competition[]
 */
const getAllCompetitions = function() {
    return getCompetition();
};

/**
 * Returns a new competition object using the provided competition code
 *
 * @param {string} code The competition code
 * @returns {Competition}
 */
const getCompetition = function(code) {
    var result = null;
    glob.sync('lib/competitions/*.js').forEach((file) => {
        if (!file.endsWith('competition.js')) {
            if (!code || file.endsWith(`${code}.js`)) {
                var comp = require(path.resolve(file));
                result = new comp();
            }
        }
    });

    return result;
};

const Ludus = {
    /**
     * Returns all competitions available to query
     *
     * @returns Competition[]
     */
    competitions() {
        return getAllCompetitions();
    },

    /**
     * Returns a new competition object using the provided competition code
     *
     * @param {string} code The competition code
     * @returns {Competition}
     */
    competition(code) {
        return getCompetition(code);
    }
};

module.exports = Ludus;