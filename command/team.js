const competition = require('../lib/model/competition');
const columnify = require('columnify');

const commands = {
    getTeams(competitionCode) {
        var comp = competition.getCompetition(competitionCode);
        if (!comp) throw `Unable to locate competition ${competitionCode}`;

        comp.getTeams(teams => console.log(columnify(teams)));
    }
};

module.exports = commands;