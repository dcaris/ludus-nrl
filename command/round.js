const ludus = require('../lib/ludus');
const columnify = require('columnify');
const Round = require('../lib/model/round');

const commands = {
    async getMatches(competitionCode, year, round) {
        var comp = ludus.competition(competitionCode);
        if (!comp) throw new Error(`Unable to locate competition ${competitionCode}`);
        if (round && !Number.isInteger(Number.parseInt(round))) throw new Error('No round parameter provided');
        if (year && !Number.isInteger(Number.parseInt(year))) throw new Error('No year parameter provided');

        const results = await comp.results(new Round(year, round));
        console.log(columnify(results));
    },

    async getResult(competitionCode, year, round) {
        var comp = ludus.competition(competitionCode);
        if (!comp) throw new Error(`Unable to locate competition ${competitionCode}`);
        if (round && !Number.isInteger(Number.parseInt(round))) throw new Error('No round parameter provided');
        if (year && !Number.isInteger(Number.parseInt(year))) throw new Error('No year parameter provided');

        const results = await comp.results(new Round(year, round));
        console.log(columnify(results));
    },

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
    }
};

module.exports = commands;