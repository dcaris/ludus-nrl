const osmosis = require("osmosis");
const { Team } = require('../model/team');
const program = require('commander');

function getTeams(competition, callback) {
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
        .done(() => teams.forEach((team) => console.log('%s', team.fullname)));
}

exports.command = () => {
    program
        .command('teams')
        .alias('t')
        .description('List different Rugby League teams for the competition')
        .action(() => {
            getTeams('');
        })
}