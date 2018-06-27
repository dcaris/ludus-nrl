const osmosis = require("osmosis");
const { Team } = require('../model/team');
const program = require('commander');

const getTeams = (competition, callback) => {
    if (!competition) throw "No competition provided";

    var teams = [];
    osmosis
        .get('https://www.nrl.com/clubs/')
        .find('.club-card__content')
        .set({
            'name': 'h2.club-card__title'
        })
        .data((json) => {
            let team = new Team(json.name.replace('\r\n', ' '));
            teams.push(team);
        })
        .done(() => callback(teams));
};

const getPlayersForTeam = (competition, teamName, callback) => {
    if (!competition) throw "No competition provided";

    var teams = [];
    osmosis
        .get('https://www.nrl.com/clubs/')
        .find('.club-card__content')
        .set({
            'name': 'h2.club-card__title'
        })
        .data((json) => {
            let team = new Team(json.name.replace('\r\n', ' '));
            teams.push(team);
        })
        .done(() => callback(teams));
};

exports.command = () => {
    program
        .command('teams <competition>')
        .description('List different Rugby League teams for the competition')
        .action((competition) => {
            getTeams(competition,
                (teams) => teams.forEach((team) => console.log('%s', team.fullname)));
        });

    program
        .command('team <competition> <teamName>')
        .description('List different Rugby League teams for the competition')
        .action((competition, teamName) => {
            getPlayersForTeam(competition,
                teamName,
                (teams) => teams.forEach((team) => console.log('%s', team.fullname)));
        });
};