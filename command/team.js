const competition = require('../model/competition');
const program = require('commander');

const getTeams = (competitionCode) => {
    if (!competitionCode) throw "No competition provided";

    var comp = competition.getCompetition(competitionCode);
    if (!comp) throw `Unable to locate competition ${competitionCode}`;

    comp.getTeams(teams => teams.forEach((team) => console.log('%s', team.fullname)));
};

exports.command = () => {
    program
        .command('teams <competition>')
        .description('List different Rugby League teams for the competition')
        .action(competition => getTeams(competition));
};