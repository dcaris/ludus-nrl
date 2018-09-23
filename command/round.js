const ludus = require('../lib/ludus');
const columnify = require('columnify');
const Round = require('../lib/model/round');

const commands = {
    /**
     * Lists all the rounds for the year for the competition
     * @param {string} competitionCode 
     * @param {number} year 
     */
    async getRounds(competitionCode, year) {
        var comp = ludus.competition(competitionCode);
        if (!comp) throw new Error(`Unable to locate competition ${competitionCode}`);

        const rounds = await comp.rounds(year);
        console.log(columnify(rounds));
    },

    /**
     * Lists the results for all the matches in a round
     *
     * @param {*} competitionCode
     * @param {*} year
     * @param {*} round
     */
    async getMatches(competitionCode, year, round) {
        var comp = ludus.competition(competitionCode);
        if (!comp) throw new Error(`Unable to locate competition ${competitionCode}`);
        if (round && !Number.isInteger(Number.parseInt(round))) throw new Error('No round parameter provided');
        if (year && !Number.isInteger(Number.parseInt(year))) throw new Error('No year parameter provided');

        const results = await comp.results(year, round);
        console.log(columnify(results));
    }
};

module.exports = commands;