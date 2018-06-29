const program = require('commander');
const competition = require('../model/competition');
const columnify = require('columnify');

const getCompetitions = () => {
    var competitions = competition.getAllCompetitions();
    console.log(columnify(competitions, {
        columns: ['code', 'name', 'location']
    }));
};

exports.command = () => program
    .command('competition')
    .alias('c')
    .description('List different Rugby League competitions')
    .action(() => getCompetitions());