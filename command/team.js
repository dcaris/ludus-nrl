const ludus = require('../lib/ludus');
const columnify = require('columnify');

const commands = {
    async getTeams(competitionCode) {
        var comp = ludus.competitions(competitionCode);
        if (!comp) throw `Unable to locate competition ${competitionCode}`;

        const teams = await comp.clubs();
        console.log(columnify(teams));
    }
};

module.exports = commands;