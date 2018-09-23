const ludus = require('../lib/ludus');
const columnify = require('columnify');
const Round = require('../lib/model/round');

const commands = {
    /**
     * Lists the results for all the matches in a round
     *
     * @param {string} competitionCode
     * @param {number} year
     * @param {number} round
     */
    async getResults(competitionCode, year, round) {
        var comp = ludus.competition(competitionCode);
        if (!comp) throw new Error(`Unable to locate competition ${competitionCode}`);
        if (round && !Number.isInteger(Number.parseInt(round))) throw new Error('No round parameter provided');
        if (year && !Number.isInteger(Number.parseInt(year))) throw new Error('No year parameter provided');

        const results = await comp.results(new Round(year, round));
        console.log(columnify(results));
    },

    /**
     * Lists the detailed results for a match in a round
     *
     * @param {string} competitionCode
     * @param {number} year
     * @param {number} round
     * @param {string} homeTeam
     * @param {string} awayTeam
     */
    async getMatchDetails(competitionCode, year, round, homeTeam, awayTeam) {
        var comp = ludus.competition(competitionCode);
        if (!comp) throw new Error(`Unable to locate competition ${competitionCode}`);
        if (round && !Number.isInteger(Number.parseInt(round))) throw new Error('No round parameter provided');
        if (year && !Number.isInteger(Number.parseInt(year))) throw new Error('No year parameter provided');
        if (!homeTeam) throw new Error(`Home Team nickname not provided '${homeTeam}'`);
        if (!awayTeam) throw new Error(`Away Team nickname not provided '${awayTeam}'`);

        const results = await comp.match(year, round, homeTeam, awayTeam);
        console.log(columnify(results));
    },

    /**
     * Lists the detailed statistics per player for a match in a round
     *
     * @param {string} competitionCode
     * @param {number} year
     * @param {number} round
     * @param {string} homeTeam
     * @param {string} awayTeam
     */
    async getPlayerStatistics(competitionCode, year, round, homeTeam, awayTeam) {
        var comp = ludus.competition(competitionCode);
        if (!comp) throw new Error(`Unable to locate competition ${competitionCode}`);
        if (round && !Number.isInteger(Number.parseInt(round))) throw new Error('No round parameter provided');
        if (year && !Number.isInteger(Number.parseInt(year))) throw new Error('No year parameter provided');
        if (!homeTeam) throw new Error(`Home Team nickname not provided '${homeTeam}'`);
        if (!awayTeam) throw new Error(`Away Team nickname not provided '${awayTeam}'`);

        const results = await comp.matchStatistics(year, round, homeTeam, awayTeam);
        console.log(columnify(results));
    },
};

module.exports = commands;