const competition = require('../lib/model/competition');
const columnify = require('columnify');

const commands = {
    getCompetitions() {
        var competitions = competition.getAllCompetitions();
        console.log(columnify(competitions, {
            columns: ['code', 'name', 'location']
        }));
    }
};

module.exports = commands;